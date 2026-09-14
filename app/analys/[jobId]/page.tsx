import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScanProgress } from "@/components/analyzer/scan-progress";
import { ReportDashboard } from "@/components/report/report-dashboard";
import { readJob } from "@/lib/analyzer/store";

export const dynamic = "force-dynamic";

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

export default async function JobPage({ params }: PageProps<"/analys/[jobId]">) {
  const { jobId } = await params;
  const job = await readJob(jobId);
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {job.status === "complete" && job.report ? (
        <ReportDashboard job={job} />
      ) : (
        <ScanProgress jobId={job.id} />
      )}
    </div>
  );
}
