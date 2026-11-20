import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CURRENT_USER_ID = 'user_coy_current';

const mockProfiles = [
  {
    userId: 'user_sophia_01',
    name: 'Sophia Martinez',
    age: 22,
    cityOrCollege: 'NYU • Stern',
    occupation: 'Design Strategist',
    bio: 'Golden hour hunter, amateur ceramicist, and passionate about matchas with oat milk. Tell me the last song that gave you chills.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    interests: ['Ceramics', 'Matcha', 'Indie Rock', 'Film Photography', 'Museums'],
    hasLikedCurrentUser: true,
  },
  {
    userId: 'user_liam_02',
    name: 'Liam Chen',
    age: 24,
    cityOrCollege: 'Columbia University',
    occupation: 'Architecture Fellow',
    bio: 'Obsessed with brutalist buildings, pour-over coffee, and 35mm street photography. Always down for spontaneous taco runs.',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    interests: ['Architecture', 'Street Photography', 'Coffee Brewing', 'Jazz', 'Bouldering'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_maya_03',
    name: 'Maya Patel',
    age: 21,
    cityOrCollege: 'Stanford University',
    occupation: 'Bioengineering Student',
    bio: 'Balancing pipettes by day and indie gig pits by night. Will debate you on the best sci-fi novels of all time.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    interests: ['Sci-Fi', 'Live Music', 'Hiking', 'Neuroscience', 'Boba'],
    hasLikedCurrentUser: true,
  },
  {
    userId: 'user_lucas_04',
    name: 'Lucas Silva',
    age: 25,
    cityOrCollege: 'Austin, TX',
    occupation: 'Sound Engineer',
    bio: 'Vinyl collector, vintage synth hoarder, and weekend sourdough experimenter. Looking for someone to explore record shops with.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    interests: ['Vinyl', 'Sourdough', 'Synthesizers', 'Cycling', 'House Plants'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_elena_05',
    name: 'Elena Rostova',
    age: 23,
    cityOrCollege: 'UC Berkeley',
    occupation: 'Creative Writer',
    bio: 'Poetry in the morning, bouldering in the evening. I believe thrift stores have souls and good tea cures almost anything.',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    interests: ['Thrifting', 'Bouldering', 'Poetry', 'Tea Tasting', 'Art Galleries'],
    hasLikedCurrentUser: true,
  },
  {
    userId: 'user_marcus_06',
    name: 'Marcus Vance',
    age: 26,
    cityOrCollege: 'Seattle, WA',
    occupation: 'Cloud Infrastructure Dev',
    bio: 'Backpacking in the Cascades whenever weather permits. Fluent in TypeScript, campfires, and bad dad jokes.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    interests: ['Backpacking', 'Trail Running', 'Camping', 'Coding', 'Board Games'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_chloe_07',
    name: 'Chloe Bennett',
    age: 22,
    cityOrCollege: 'Brown University',
    occupation: 'Art History & Curating',
    bio: 'Can tell you the provenance of random paintings. 10/10 dog enthusiast. Send me your current on-repeat playlist!',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    interests: ['Art History', 'Dogs', 'Playlists', 'French Cinema', 'Croissants'],
    hasLikedCurrentUser: true,
  },
  {
    userId: 'user_daniel_08',
    name: 'Daniel Kim',
    age: 24,
    cityOrCollege: 'Northwestern University',
    occupation: 'UX Designer',
    bio: 'Making interfaces intuitive and living on iced americanos. Let\'s find the best rooftop sunsets and secret speakeasies.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    interests: ['UX Design', 'Cocktail Bars', 'Sunsets', 'City Walks', 'Typography'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_zara_09',
    name: 'Zara Al-Mansoor',
    age: 23,
    cityOrCollege: 'Toronto / McGill',
    occupation: 'Environmental Journalist',
    bio: 'Investigating climate solutions and collecting postcards from everywhere I travel. Big fan of hearty stews and deep talks.',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    interests: ['Journalism', 'Sustainability', 'Travel', 'Reading', 'Kayaking'],
    hasLikedCurrentUser: true,
  },
  {
    userId: 'user_noah_10',
    name: 'Noah Gallagher',
    age: 25,
    cityOrCollege: 'Boston University',
    occupation: 'Sous Chef',
    bio: 'Culinary school grad turning farmers market hauls into feast nights. I will cook you handmade pasta on our third date.',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    interests: ['Cooking', 'Culinary Arts', 'Farmers Markets', 'Natural Wine', 'Pasta'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_isabella_11',
    name: 'Isabella Rossi',
    age: 21,
    cityOrCollege: 'USC • Film School',
    occupation: 'Cinematographer',
    bio: 'Obsessed with lighting, 16mm grain, and dramatic film scores. Ready to shoot a music video or grab midnight diner pancakes.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    interests: ['Cinematography', 'Film', 'Diners', 'Screenwriting', 'Road Trips'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_ethan_12',
    name: 'Ethan Brooks',
    age: 26,
    cityOrCollege: 'Chicago, IL',
    occupation: 'Product Manager',
    bio: 'Marathon runner, improv comedy student, and avid podcast listener. High energy, loves trivia nights and lakefront jogs.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    interests: ['Marathon', 'Improv', 'Podcasts', 'Trivia', 'Running'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_aria_13',
    name: 'Aria Takahashi',
    age: 22,
    cityOrCollege: 'University of Washington',
    occupation: 'Game Narrative Designer',
    bio: 'Crafting cozy fantasy quests and brewing floral teas. Tell me your favorite video game ending that broke your heart.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    interests: ['Gaming', 'Worldbuilding', 'Tea', 'Cosplay', 'Graphic Novels'],
    hasLikedCurrentUser: true,
  },
  {
    userId: 'user_leo_14',
    name: 'Leo Morales',
    age: 24,
    cityOrCollege: 'UCLA',
    occupation: 'Landscape Photographer',
    bio: 'Chasing storms and golden hours across national parks. My Jeep is basically a mobile home and I take road trip snacks seriously.',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    interests: ['National Parks', 'Photography', 'Road Trips', 'Astronomy', 'Campfires'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_nina_15',
    name: 'Nina Kowalski',
    age: 23,
    cityOrCollege: 'Pratt Institute',
    occupation: 'Industrial Designer',
    bio: '3D printing weird lamps and exploring industrial heritage sites. I notice chair proportions wherever I sit.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    interests: ['Industrial Design', '3D Printing', 'Modernism', 'Flea Markets', 'Minimalism'],
    hasLikedCurrentUser: true,
  },
  {
    userId: 'user_julian_16',
    name: 'Julian Thorne',
    age: 25,
    cityOrCollege: 'Georgetown University',
    occupation: 'Policy Analyst',
    bio: 'Policy nerd with a passion for jazz bass and trivia. Always looking for the most obscure bookstore in town.',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    interests: ['Jazz Bass', 'History', 'Bookstores', 'Diplomacy', 'Chess'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_ananya_17',
    name: 'Ananya Sharma',
    age: 22,
    cityOrCollege: 'IIT Bombay / Cornell',
    occupation: 'Robotics Researcher',
    bio: 'Building quadrupeds and dancing kathak on weekends. I can talk for hours about AI ethics and street food.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    interests: ['Robotics', 'Classical Dance', 'Street Food', 'Philosophy', 'Sci-Fi'],
    hasLikedCurrentUser: true,
  },
  {
    userId: 'user_samuel_18',
    name: 'Samuel O\'Connor',
    age: 26,
    cityOrCollege: 'Trinity College Dublin',
    occupation: 'Documentary Producer',
    bio: 'Storytelling around the world. Big believer in wild swimming, dry humor, and long walks in misty rain.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    interests: ['Documentaries', 'Wild Swimming', 'Writing', 'Folk Music', 'Literature'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_freja_19',
    name: 'Freja Lindqvist',
    age: 24,
    cityOrCollege: 'Stockholm University',
    occupation: 'Fashion Stylist & Archivist',
    bio: 'Vintage Scandinavian fashion curator. Loves Nordic noir series, cinnamon buns, and icy morning runs.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    interests: ['Vintage Fashion', 'Baking', 'Scandi Design', 'Winter Sports', 'Cinema'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_mateo_20',
    name: 'Mateo Gomez',
    age: 23,
    cityOrCollege: 'Miami University',
    occupation: 'Marine Biologist',
    bio: 'Scuba diver and coral reef restoration tech. 90% of my clothes smell like saltwater. Let\'s go snorkeling or find key lime pie.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    interests: ['Scuba Diving', 'Marine Life', 'Surfing', 'Salsa', 'Eco-Conservation'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_kai_21',
    name: 'Kai Tanaka',
    age: 21,
    cityOrCollege: 'Tokyo University / RISD',
    occupation: 'Illustrator & Animator',
    bio: 'Sketching quirky characters on the subway. Loves ramen tasting, studio ghibli aesthetic, and city pop vinyl.',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    interests: ['Animation', 'Illustration', 'Ramen', 'City Pop', 'Sketchbooks'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_camila_22',
    name: 'Camila Duarte',
    age: 25,
    cityOrCollege: 'Buenos Aires / Harvard',
    occupation: 'Economist & Writer',
    bio: 'Tango dancer, book lover, and espresso purist. Seeking someone who enjoys late dinner conversations that stretch past midnight.',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    interests: ['Tango', 'Economics', 'Espresso', 'Latin Literature', 'Travel'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_oliver_23',
    name: 'Oliver Wright',
    age: 24,
    cityOrCollege: 'Oxford University',
    occupation: 'Antique Horologist',
    bio: 'Restoring mechanical watches from the 1800s. I appreciate slow living, handwritten letters, and tweed jackets.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    interests: ['Watches', 'History', 'Antiques', 'Rowing', 'Classic Rock'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_leila_24',
    name: 'Leila Faris',
    age: 23,
    cityOrCollege: 'Beirut / Parsons School of Design',
    occupation: 'Textile Artisan',
    bio: 'Weaving modern tapestries with natural plant dyes. Always up for mezze brunches and wandering modern art fairs.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    interests: ['Textiles', 'Weaving', 'Natural Dyes', 'Mediterranean Food', 'Art Fairs'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_gabriel_25',
    name: 'Gabriel Santos',
    age: 26,
    cityOrCollege: 'Rio de Janeiro / San Diego',
    occupation: 'Surf Instructor & Physical Therapist',
    bio: 'Catching waves before dawn, helping athletes recover by noon, and playing acoustic guitar at sunset bonfires.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    interests: ['Surfing', 'Acoustic Guitar', 'Wellness', 'Beach Volleyball', 'Sunset Chasing'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_nadia_26',
    name: 'Nadia Solis',
    age: 22,
    cityOrCollege: 'UT Austin',
    occupation: 'Music Producer & DJ',
    bio: 'Late night studio sessions and daytime vintage synthesizers. If you like synth-pop and spicy queso, we\'ll get along.',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    interests: ['DJing', 'Synthesizers', 'Live Shows', 'Tex-Mex', 'Roller Skating'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_arthur_27',
    name: 'Arthur Pendelton',
    age: 25,
    cityOrCollege: 'Cambridge, MA',
    occupation: 'Astrophysics PhD Candidate',
    bio: 'Analyzing exoplanet atmospheric spectra. I have telescope keys and an endless supply of stellar facts for stargazing dates.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    interests: ['Astrophysics', 'Stargazing', 'Telescopes', 'Board Games', 'Coffee Roasting'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_talia_28',
    name: 'Talia Kim',
    age: 23,
    cityOrCollege: 'Seoul National University / Cornell',
    occupation: 'Fermentation Specialist',
    bio: 'Kombucha brewer, sourdough enthusiast, and food biochemist. Let me introduce you to foods that taste magical and boost gut health.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    interests: ['Fermentation', 'Biochemistry', 'Cooking', 'Gardening', 'K-Indie'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_felix_29',
    name: 'Felix Moreau',
    age: 24,
    cityOrCollege: 'Paris / McGill',
    occupation: 'Film Critic & Essayist',
    bio: 'Analyzing nouvelle vague films and sipping black coffee at corner cafés. I hold strong opinions on popcorn vs candy at the cinema.',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    interests: ['Film Noir', 'Essays', 'Café Hopping', 'Vintage Posters', 'Philosophy'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_amara_30',
    name: 'Amara Diallo',
    age: 22,
    cityOrCollege: 'Penn State University',
    occupation: 'Track & Field Athlete & Bioethics',
    bio: 'Hurdler on the track, thinker in the bioethics lab. High energy, loves afrobeat concerts and post-workout smoothies.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    interests: ['Track & Field', 'Afrobeats', 'Smoothies', 'Bioethics', 'Podcasts'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_jasper_31',
    name: 'Jasper Cole',
    age: 25,
    cityOrCollege: 'University of Edinburgh',
    occupation: 'Botanist & Florist',
    bio: 'Surrounded by orchids and rare ferns. I can revive any dying houseplant and will bring you wildflowers just because.',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    interests: ['Botany', 'Plant Propagation', 'Hiking', 'Wildflowers', 'Acoustic Folk'],
    hasLikedCurrentUser: false,
  },
  {
    userId: 'user_clara_32',
    name: 'Clara Oswald',
    age: 23,
    cityOrCollege: 'London / Central Saint Martins',
    occupation: 'Ceramic Sculptor',
    bio: 'Clay-covered apron is my signature look. Let\'s get dirty on the pottery wheel and grab fish & chips by the canal.',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    interests: ['Pottery', 'Sculpture', 'Street Markets', 'Canal Walks', 'Vintage Records'],
    hasLikedCurrentUser: false,
  },
];

async function main() {
  console.log('🌱 Starting Coy database seeding...');

  // Clean existing data
  await prisma.match.deleteMany({});
  await prisma.swipe.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Current Logged-in User
  const currentUser = await prisma.user.create({
    data: {
      id: CURRENT_USER_ID,
      email: 'alex@coy.app',
      profile: {
        create: {
          name: 'Alex Rivera',
          age: 23,
          cityOrCollege: 'New York University',
          occupation: 'Product Engineer',
          bio: 'Building things for the web, seeking the best espresso martini in NYC, and training for a half-marathon. Always down for good food and live music.',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          interests: JSON.stringify(['Tech', 'Running', 'Live Music', 'Coffee', 'Cocktails']),
          verified: true,
        },
      },
    },
  });

  console.log(`✅ Logged-in user seeded: ${currentUser.id}`);

  // 2. Create Candidate Profiles
  let seededCount = 0;
  let incomingLikesCount = 0;

  for (const item of mockProfiles) {
    const user = await prisma.user.create({
      data: {
        id: item.userId,
        email: `${item.userId}@coymock.app`,
        profile: {
          create: {
            name: item.name,
            age: item.age,
            cityOrCollege: item.cityOrCollege,
            occupation: item.occupation,
            bio: item.bio,
            photoUrl: item.photoUrl,
            interests: JSON.stringify(item.interests),
            verified: true,
          },
        },
      },
    });

    seededCount++;

    // Seed incoming like from this profile to current user if flagged
    if (item.hasLikedCurrentUser) {
      await prisma.swipe.create({
        data: {
          swiperId: user.id,
          swipedId: CURRENT_USER_ID,
          action: 'LIKE',
        },
      });
      incomingLikesCount++;
    }
  }

  console.log(`✅ Seeded ${seededCount} candidate profiles into SQLite.`);
  console.log(`🔒 Seeded ${incomingLikesCount} confidential incoming likes for mutual matching demo.`);
  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
