import { loadNGOConfig } from "@/lib/config-loader";
import { MainPortalView } from "@/components/MainPortalView";

export const revalidate = 60; // ISR revalidation fallback

export default async function HomePage() {
  const config = await loadNGOConfig();

  return <MainPortalView config={config} />;
}
