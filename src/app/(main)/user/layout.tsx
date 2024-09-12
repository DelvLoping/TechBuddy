import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TechBuddy | Profile",
  description: "Edit your from your TechBuddy account !",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
