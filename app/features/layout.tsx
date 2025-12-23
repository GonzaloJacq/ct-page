import DashboardLayout from "@/app/components/layout/DashboardLayout";

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
