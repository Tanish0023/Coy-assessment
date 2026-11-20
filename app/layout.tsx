import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy | Discover People',
  description: 'Find meaningful connections with Coy - Discover genuine profiles around you.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex justify-center antialiased">
        <div className="w-full max-w-md min-h-screen flex flex-col relative bg-neutral-950 shadow-2xl border-x border-neutral-800/40">
          {children}
        </div>
      </body>
    </html>
  );
}
