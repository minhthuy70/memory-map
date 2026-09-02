
import type { Metadata } from 'next';
import './globals.css';
import SessionWarning from '@/components/SessionWarning';

export const metadata: Metadata = {
  title: 'Memory Map',
  description: 'A digital diary spread across a map.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SessionWarning />
        {children}
      </body>
    </html>
  );
}