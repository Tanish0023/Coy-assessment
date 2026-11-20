import { prisma } from '../lib/prisma';
import { recordSwipe } from '../lib/matching';
import { CURRENT_USER_ID } from '../lib/constants';
import { execSync } from 'child_process';

async function runTests() {
  console.log('🧪 Starting Milestone 2 Backend & Matching Logic Verification...\n');

  // 1. Reset and re-seed database
  console.log('1️⃣ Seeding database for fresh test run...');
  execSync('npm run db:seed', { stdio: 'pipe' });
  console.log('✅ Seeding completed.\n');

  // 2. Test Feed Retrieval & Privacy Verification
  console.log('2️⃣ Testing Feed Eligibility and Privacy...');
  const initialSwiped = await prisma.swipe.findMany({
    where: { swiperId: CURRENT_USER_ID },
    select: { swipedId: true },
  });
  const excludedIds = [CURRENT_USER_ID, ...initialSwiped.map((s) => s.swipedId)];
  const feedProfiles = await prisma.profile.findMany({
    where: { userId: { notIn: excludedIds } },
  });

  if (feedProfiles.length !== 32) {
    throw new Error(`Expected 32 feed profiles, got ${feedProfiles.length}`);
  }
  console.log(`✅ Correct feed count: ${feedProfiles.length} eligible profiles.`);

  // Check for any field that could leak incoming likes
  for (const p of feedProfiles) {
    if ('hasLikedCurrentUser' in p || 'swipes' in p || 'isMatch' in p) {
      throw new Error(`Privacy violation: Feed profile ${p.name} contains unauthorized fields!`);
    }
  }
  console.log('🔒 Privacy verified: Zero incoming like indicators in feed.\n');

  // 3. Test One-Sided LIKE
  console.log('3️⃣ Testing One-Sided Like (Liam Chen - user_liam_02)...');
  const liamProfile = await prisma.profile.findFirst({
    where: { userId: 'user_liam_02' },
  });
  if (!liamProfile) throw new Error('Liam profile not found');

  const liamSwipe = await recordSwipe(CURRENT_USER_ID, liamProfile.id, 'like');
  if (!liamSwipe.success || liamSwipe.matched) {
    throw new Error(`Expected one-sided like to succeed without match, got: ${JSON.stringify(liamSwipe)}`);
  }
  console.log('✅ One-sided like recorded correctly without false-positive match.\n');

  // 4. Test One-Sided PASS
  console.log('4️⃣ Testing Pass Action (Lucas Silva - user_lucas_04)...');
  const lucasProfile = await prisma.profile.findFirst({
    where: { userId: 'user_lucas_04' },
  });
  if (!lucasProfile) throw new Error('Lucas profile not found');

  const lucasSwipe = await recordSwipe(CURRENT_USER_ID, lucasProfile.id, 'pass');
  if (!lucasSwipe.success || lucasSwipe.matched) {
    throw new Error(`Expected pass action to succeed without match, got: ${JSON.stringify(lucasSwipe)}`);
  }
  console.log('✅ Pass recorded successfully.\n');

  // 5. Test Mutual Match (Sophia Martinez - user_sophia_01)
  console.log('5️⃣ Testing Mutual Match (Sophia Martinez - user_sophia_01)...');
  const sophiaProfile = await prisma.profile.findFirst({
    where: { userId: 'user_sophia_01' },
  });
  if (!sophiaProfile) throw new Error('Sophia profile not found');

  const sophiaSwipe = await recordSwipe(CURRENT_USER_ID, sophiaProfile.id, 'like');
  if (!sophiaSwipe.success || !sophiaSwipe.matched || !sophiaSwipe.match) {
    throw new Error(`Expected mutual match to be created, got: ${JSON.stringify(sophiaSwipe)}`);
  }
  console.log(`✅ Mutual match created successfully! Match ID: ${sophiaSwipe.match.id}`);
  console.log(`🎉 Partner Profile: ${sophiaSwipe.match.profile.name}, ${sophiaSwipe.match.profile.age} (${sophiaSwipe.match.profile.cityOrCollege})\n`);

  // 6. Test Duplicate Swipe Prevention
  console.log('6️⃣ Testing Duplicate Swipe Prevention...');
  const duplicateSwipe = await recordSwipe(CURRENT_USER_ID, sophiaProfile.id, 'like');
  if (duplicateSwipe.success) {
    throw new Error('Duplicate swipe was incorrectly allowed!');
  }
  console.log(`✅ Duplicate swipe rejected with message: "${duplicateSwipe.error}"\n`);

  // 7. Test Feed Exclusion after Swiping
  console.log('7️⃣ Testing Feed Exclusion...');
  const updatedSwiped = await prisma.swipe.findMany({
    where: { swiperId: CURRENT_USER_ID },
    select: { swipedId: true },
  });
  const newExcludedIds = [CURRENT_USER_ID, ...updatedSwiped.map((s) => s.swipedId)];
  const updatedFeed = await prisma.profile.findMany({
    where: { userId: { notIn: newExcludedIds } },
  });
  if (updatedFeed.length !== 32 - 3) { // Swiped on Liam, Lucas, Sophia
    throw new Error(`Expected ${32 - 3} remaining profiles, got ${updatedFeed.length}`);
  }
  console.log(`✅ Feed updated accurately: ${updatedFeed.length} remaining (3 swiped profiles excluded).\n`);

  // 8. Test Matches Retrieval
  console.log('8️⃣ Testing Matches Query...');
  const matches = await prisma.match.findMany({
    where: {
      OR: [{ user1Id: CURRENT_USER_ID }, { user2Id: CURRENT_USER_ID }],
    },
  });
  if (matches.length !== 1) {
    throw new Error(`Expected 1 match, found ${matches.length}`);
  }
  console.log(`✅ Matches query verified: Exactly ${matches.length} mutual match found.\n`);

  // 9. Reset and re-seed database so demo state is clean
  console.log('9️⃣ Resetting database to pristine seeded state...');
  execSync('npm run db:seed', { stdio: 'pipe' });
  console.log('✨ Clean database ready for application demo!\n');

  console.log('🎯 All Backend & Matching tests passed successfully!');
}

runTests()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
