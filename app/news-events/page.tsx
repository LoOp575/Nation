import { getNationalSnapshot } from "@/lib/data/national-snapshot";
import { NewsEventsView } from "@/components/modules/news-events-view";

export const dynamic = "force-dynamic";

export default async function NewsEventsPage() {
  const snapshot = await getNationalSnapshot();
  return <NewsEventsView snapshot={snapshot} />;
}
