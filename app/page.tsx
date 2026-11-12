import { getNationalSnapshot } from "@/lib/data/national-snapshot";
import { ExecutiveCommandCenter } from "@/components/dashboard/executive-command-center";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const snapshot = await getNationalSnapshot();
  const todayLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  return (
    <ExecutiveCommandCenter snapshot={snapshot} todayLabel={todayLabel} />
  );
}
