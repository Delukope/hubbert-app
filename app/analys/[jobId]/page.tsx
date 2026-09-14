import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ScanProgress } from "@/components/analyzer/scan-progress";
import { ReportDashboard } from "@/components/report/report-dashboard";
import { readJob } from "@/lib/analyzer/store";
import { fulfillStripeSession } from "@/lib/billing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: PageProps<"/analys/[jobId]">): Promise<Metadata> {
  const { jobId } = await params;
  const job = await readJob(jobId);
  if (!job) return { title: "Rapport" };
  let host = job.url;
  try {
    host = new URL(job.url).hostname;
  } catch {
    /* keep */
  }
  return {
    title: job.report ? `Rapport: ${host}` : `Analyserar ${host}`,
    robots: { index: false, follow: false },
  };
}

export default async function JobPage({
  params,
  searchParams,
}: PageProps<"/analys/[jobId]">) {
  await connection();
  const { jobId } = await params;
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : undefined;
  if (sessionId) {
    try {
      await fulfillStripeSession(sessionId);
    } catch {
      /* webhook kan komma senare */
    }
  }
  const job = await readJob(jobId);
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {job.status === "complete" && job.report ? (
        <ReportDashboard job={job} />
      ) : (
        <ScanProgress jobId={job.id} url={job.url} />
      )}
    </div>
  );
}
