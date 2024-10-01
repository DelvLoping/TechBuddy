import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechBuddy - Terms and Conditions',
  description: 'Terms and conditions for using TechBuddy services.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
