import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import StoreProvider from './StoreProviders';
import _ from 'lodash';
import BackGround from '@/components/macro/BackGround';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='light'>
      <body className={inter.className}>
        <BackGround />
        <Providers>
          <StoreProvider>{children}</StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
