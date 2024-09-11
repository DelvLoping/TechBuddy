import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechBuddy - FAQ',
  description: 'Frequently asked questions about TechBuddy and how we can help you.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
