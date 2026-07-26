import { Link } from 'react-router-dom';
import { getEnabledRssCategories } from '@/lib/rssFeeds';
import { RssLivePanel } from '@/components/RssLivePanel';
import { SectionDivider } from '@/components/SectionDivider';

/** Category live RSS blocks on Home */
export function HomeCategoryRssBlocks() {
  const categories = getEnabledRssCategories();
  return (
    <>
      {categories.map((cat, i) => (
        <div key={`${cat.id}-${cat.source}-${cat.channelId || cat.rssUrl || ''}`}>
          <RssLivePanel category={cat} sectionId={`section-${cat.id}`} />
          {i < categories.length - 1 && (
            <SectionDivider colors="from-transparent via-rose-500/30 to-transparent" />
          )}
        </div>
      ))}
    </>
  );
}

export function CategoryPageRss({ categoryId }: { categoryId: string }) {
  const category = getEnabledRssCategories().find((c) => c.id === categoryId);
  if (!category) return null;
  return <RssLivePanel category={category} showOpenLink={false} />;
}

/** Quick links strip used inside detailed category pages */
export function CategorySisterLinks({ current }: { current: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="flex items-center gap-2 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
        <span className="text-[9px] font-orbitron uppercase tracking-widest text-gray-600 shrink-0">
          Also watch
        </span>
        {getEnabledRssCategories()
          .filter((c) => c.id !== current)
          .map((c) => (
            <Link
              key={c.id}
              to={c.path}
              className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-orbitron uppercase tracking-wider border border-white/10 text-gray-400 hover:text-white hover:border-red-500/40 transition-all"
            >
              {c.title}
            </Link>
          ))}
      </div>
    </div>
  );
}
