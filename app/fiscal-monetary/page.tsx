import { getNationalSnapshot } from "@/lib/data/national-snapshot";
import { FiscalMonetaryView } from "@/components/modules/fiscal-monetary-view";

export const dynamic = "force-dynamic";

export default async function FiscalMonetaryPage() {
  const snapshot = await getNationalSnapshot();
  return <FiscalMonetaryView snapshot={snapshot} />;
}
