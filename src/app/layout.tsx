import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AppShell from '@/components/AppShell';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'EA Mart | Enterprise Retail Management Platform',
  description: 'A connected retail operations platform for point of sale, inventory, purchasing, customer management and business insights.',
  icons: { icon: '/ea-mart.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-BD" className={`h-full ${inter.variable}`}>
      <body className="h-full m-0 p-0 overflow-hidden bg-slate-100 text-slate-900 antialiased">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
