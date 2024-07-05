import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Card } from "@nextui-org/react";
import StoreProvider from "./StoreProviders";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <Providers>
          <StoreProvider>
            <div className="flex justify-center items-center h-screen p-10">
              <Card className="h-full p-8 pt-6 overflow-y-auto rounded-3xl w-[80vw]">
                {children}
              </Card>
            </div>
          </StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
