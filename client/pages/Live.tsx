import { CategoryPageShell } from '@/components/CategoryPageShell';
import { ContentRow } from '@/components/ContentRow';
import { CategoryPageRss, CategorySisterLinks } from '@/sections/HomeCategoryRss';
import { LIVE_STREAMS, LIVE_UPCOMING } from '@/lib/catalog';

export default function Live() {
  return (
    <CategoryPageShell
      badge="On Air"
      title="Live Stream"
      subtitle="Entertainment live sessions, concerts and on-platform streams."
      heroImage="/landscape/THEMISSINGLINK.jpg"
    >
      <CategorySisterLinks current="live" />
      <CategoryPageRss categoryId="live" />
      <ContentRow
        title="On Air Now"
        subtitle="Join thousands watching live"
        items={LIVE_STREAMS.filter((s) => s.badge === 'LIVE')}
        landscape
      />
      <ContentRow title="Trending Live" subtitle="Most popular streams" items={LIVE_STREAMS} ranked landscape />
      <ContentRow title="Coming Up" subtitle="Don't miss these" items={LIVE_UPCOMING} landscape />
    </CategoryPageShell>
  );
}
