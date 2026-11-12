import { getNationalSnapshot } from "@/lib/data/national-snapshot";
import { AiAnalystView } from "@/components/modules/ai-analyst-view";

export const dynamic = "force-dynamic";

export default async function AiAnalystPage() {
  const snapshot = await getNationalSnapshot();
  return <AiAnalystView snapshot={snapshot} />;
}
