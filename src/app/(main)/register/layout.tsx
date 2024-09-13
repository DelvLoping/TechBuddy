import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechBuddy - Register',
  description:
    'Register to TechBuddy. Create an account to get started with your journey to become a tech expert or a tech helper.'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
