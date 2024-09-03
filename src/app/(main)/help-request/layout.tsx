import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechBuddy | Help Request",
  description:
    "Request help from a TechBuddy volunteer. We are here to help you with your tech-related questions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
