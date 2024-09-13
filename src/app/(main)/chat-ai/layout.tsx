import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechBuddy - Chat AI',
  description: 'Chat with our AI to get help with your problems!'
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
