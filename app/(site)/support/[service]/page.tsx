import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SupportServicePage } from '@/components/support/SupportServicePage';
import { getSingle } from '@/lib/content/queries';
import type { SingleKey } from '@/lib/content/registry';

/**
 * The support service pages. Each address maps to its content document and the
 * width its hero text wraps at in the design (class names are written out in
 * full so Tailwind generates them).
 */
const SERVICES = {
  'post-diagnostic-support': { key: 'support-post-diagnostic', bodyWidth: 'xl:u-max-w-700' },
  'adhd-coaching': { key: 'support-adhd-coaching', bodyWidth: 'xl:u-max-w-920' },
  therapy: { key: 'support-therapy', bodyWidth: 'xl:u-max-w-780' },
  'medication-pathway': { key: 'support-medication', bodyWidth: 'xl:u-max-w-870' },
  'parent-support': { key: 'support-parent', bodyWidth: 'xl:u-max-w-925' },
} as const satisfies Record<string, { key: SingleKey; bodyWidth: string }>;

type ServiceSlug = keyof typeof SERVICES;

const isService = (slug: string): slug is ServiceSlug => Object.hasOwn(SERVICES, slug);

/** Only these five addresses exist; anything else under /support/ is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SERVICES).map((service) => ({ service }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  if (!isService(service)) return {};
  const content = await getSingle(SERVICES[service].key);
  return { title: content.label, description: content.hero.body };
}

export default async function Page({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  if (!isService(service)) notFound();
  const { key, bodyWidth } = SERVICES[service];
  const [content, support] = await Promise.all([getSingle(key), getSingle('support')]);
  return <SupportServicePage content={content} services={support.services} path={`/support/${service}`} bodyWidth={bodyWidth} />;
}
