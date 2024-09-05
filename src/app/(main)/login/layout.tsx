import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechBuddy | Login',
  description:
    'Login to your TechBuddy account. Get started with your journey to become a tech expert or a tech helper.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
