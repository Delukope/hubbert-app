import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { ScanJob, ScanIssue } from "@/lib/analyzer/types";
import { isDeep } from "@/lib/analyzer/access";
import { formatBytes, formatMs } from "@/lib/utils";
import { copy } from "@/lib/copy";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a1408" },
  kicker: { fontSize: 9, letterSpacing: 1.4, color: "#7a6a4a", marginBottom: 6 },
  h1: { fontSize: 22, marginBottom: 8 },
  h2: { fontSize: 14, marginTop: 16, marginBottom: 6 },
  muted: { color: "#5c564c", marginBottom: 4 },
  score: { fontSize: 28, marginVertical: 8 },
  item: { marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid #e6dfd2" },
  title: { fontSize: 11, marginBottom: 2 },
});

const cat: Record<ScanIssue["category"], string> = {
  security: "Sakerhet",
  performance: "Prestanda",
  seo: "SEO / E-E-A-T",
  a11y: "Tillganglighet",
  design: "Design / UX",
  "best-practice": "Praxis",
};

function ReportPdf({ job }: { job: ScanJob }) {
  const report = job.report!;
  let host = report.url;
  try {
    host = new URL(report.fetchedUrl || report.url).hostname;
  } catch {
    /* keep */
  }
  const deep = isDeep(job);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.kicker}>
          {copy.brand.name.toUpperCase()} · {deep ? "DJUPANALYS" : "SNABB ANALYS"}
        </Text>
        <Text style={styles.h1}>{host}</Text>
        <Text style={styles.muted}>{report.fetchedUrl}</Text>
        <Text style={styles.muted}>{new Date(report.scannedAt).toLocaleString("sv-SE")}</Text>
        <Text style={styles.score}>{report.overall}/100</Text>
        <Text style={styles.muted}>
          Sakerhet {report.security.grade} · Prestanda {report.performance.score} · SEO {report.seo.score} ·
          A11y {report.a11y.score} · Design {report.design.score}
        </Text>
        <Text style={styles.h2}>Sammanfattning</Text>
        <Text>{deep ? report.deepSummary : report.summary}</Text>
        <Text style={styles.h2}>Nyckeltal</Text>
        <Text style={styles.muted}>TTFB {formatMs(report.performance.ttfbMs)}</Text>
        <Text style={styles.muted}>HTML {formatBytes(report.performance.totalBytes)}</Text>
        <Text style={styles.muted}>HTTPS {report.security.https ? "ja" : "nej"}</Text>
        <Text style={styles.h2}>Prioriterad plan</Text>
        {report.roadmap.map((item) => (
          <View key={item.order} style={styles.item}>
            <Text style={styles.title}>
              {item.order}. {item.title}
            </Text>
            <Text style={styles.muted}>{item.action}</Text>
          </View>
        ))}
        <Text style={styles.h2}>Fynd</Text>
        {report.issues.map((issue) => (
          <View key={issue.id} style={styles.item}>
            <Text style={styles.title}>
              [{cat[issue.category]}] {issue.title}
            </Text>
            <Text style={styles.muted}>{issue.description}</Text>
            <Text>{issue.recommendation}</Text>
          </View>
        ))}
        <Text style={{ marginTop: 18, fontSize: 8, color: "#8a8378" }}>
          {copy.brand.name}-analys. Inte en juridisk eller pentest-rapport. {copy.brand.domain}
        </Text>
      </Page>
    </Document>
  );
}

export async function renderReportPdf(job: ScanJob) {
  if (!job.report) throw new Error("Ingen rapport.");
  return renderToBuffer(<ReportPdf job={job} />);
}
