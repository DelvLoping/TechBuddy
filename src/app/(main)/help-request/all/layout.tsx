import { Metadata } from 'next';

const metadata: Metadata = {
  title: 'TechBuddy | Help Requests',
  description: 'Browse all help requests and find the one you can help with'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
