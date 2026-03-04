import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CFB Draft League',
  description: 'Draft your college football teams and make weekly Baylor ATS picks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">
        <header className="bg-green-800 text-white p-4 shadow-md">
          <div className="container mx-auto font-bold text-xl">
            CFB Draft League
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
