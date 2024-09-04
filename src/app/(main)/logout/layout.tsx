import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechBuddy | Logout",
  description: "Logout from your TechBuddy account. We hope to see you soon!",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
