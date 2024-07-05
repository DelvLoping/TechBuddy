import { Metadata } from "next";

const metadata: Metadata = {
  title: "TechBuddy | Help Request"
  description:
    "Login to your TechBuddy account. Get started with your journey to become a tech expert or a tech helper.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
