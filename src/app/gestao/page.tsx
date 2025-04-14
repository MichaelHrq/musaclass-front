import { auth } from "@/auth";
import Dashboard from "@/components/page/gestao/dashboard";

export default async function DashboardGst() {
  const session = await auth();
  console.log(session);
  return <Dashboard />;
}
