import { CategoryPageShell } from '@/components/CategoryPageShell';
import { ContentRow } from '@/components/ContentRow';
import { CategoryPageRss, CategorySisterLinks } from '@/sections/HomeCategoryRss';
import { WEBSERIES, WEBSERIES_BINGE, WEBSERIES_NEW } from '@/lib/catalog';

export default function Webseries() {
 return (
 <CategoryPageShell
 badge="Binge"
 title="Web Series"
 subtitle="Episode after episode — plus live RSS trailers and series drops."
 heroImage="/Landscape-New-Desi/DARK CITY FILES.jpg"
 >
 <CategorySisterLinks current="webseries" />
 <CategoryPageRss categoryId="webseries" />
 <ContentRow title="New & Hot" subtitle="Fresh drops this week" items={WEBSERIES_NEW} ranked />
 <ContentRow title="Binge Worthy" subtitle="Finish the season tonight" items={WEBSERIES_BINGE} />
 <ContentRow title="All Series" subtitle="Every show on ChalChitra" items={WEBSERIES} />
 <ContentRow title="Continue Watching Vibes" subtitle="Pick up where you left off" items={WEBSERIES.slice(0, 6)} landscape />
 </CategoryPageShell>
 );
}
