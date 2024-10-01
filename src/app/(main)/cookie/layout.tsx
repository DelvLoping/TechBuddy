import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechBuddy - Cookie Policy',
  description: 'Cookie policy for using TechBuddy services.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
