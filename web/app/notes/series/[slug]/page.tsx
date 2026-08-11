import { notFound } from "next/navigation";
import SeriesDetail from "@/components/notes/glass/pages/SeriesDetail";
import { getSeries, getSeriesBySlug } from "@/content/notes";

export function generateStaticParams() {
  return getSeries().map((series) => ({ slug: series.slug }));
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();
  return <SeriesDetail series={series} />;
}
