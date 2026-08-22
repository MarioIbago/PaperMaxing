"use client";

import { useParams } from "next/navigation";
import LocalPaperOverview from "../../papers/[paperId]/local-paper-overview";

export default function LocalPaperPage() {
  const params = useParams<{ paperId: string }>();
  return <LocalPaperOverview paperId={params.paperId} />;
}
