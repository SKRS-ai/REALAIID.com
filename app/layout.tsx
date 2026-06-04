import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PHL-01 // Sovereign Bureau',
  description: 'Digital Sovereignty & Forensic Trust Framework',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}