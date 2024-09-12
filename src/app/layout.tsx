import { Inter } from 'next/font/google';
import './globals.css';
import styles from './BackgroundShapes.module.scss'; // Assuming you have this CSS module
import { Providers } from './providers';
import { Card } from '@nextui-org/react';
import StoreProvider from './StoreProviders';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

const BackgroundShapes = () => {
  return (
    <div className={styles.bubbles}>
      {Array.from({ length: 50 }).map((_, index) => (
        <React.Fragment key={index}>
          <div className={styles.bubble}></div>
          <div className={styles.square}></div>
          <div className={styles.triangle}></div>
          <div className={styles.spiral}></div>
          <div className={styles.cross}></div>
        </React.Fragment>
      ))}
    </div>
  );
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        {/* Render BackgroundShapes */}
        <BackgroundShapes />
        <Providers>
          <StoreProvider>{children}</StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
