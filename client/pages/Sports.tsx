import { CategoryPageShell } from '@/components/CategoryPageShell';
import { ContentRow } from '@/components/ContentRow';
import { CategoryPageRss, CategorySisterLinks } from '@/sections/HomeCategoryRss';
import { SPORTS, SPORTS_HIGHLIGHTS, SPORTS_LIVE } from '@/lib/catalog';

export default function Sports() {
 return (
 <CategoryPageShell
 badge="Arena"
 title="Sports"
 subtitle="Live matches, highlights and iconic sporting moments — with live RSS streams."
 heroImage="/Landscape-New-Desi/MYSTERY JUNCTION.jpg"
 >
 <CategorySisterLinks current="sports" />
 <CategoryPageRss categoryId="sports" />
 <ContentRow title="Live & Hot" subtitle="Happening now" items={SPORTS_LIVE.length ? SPORTS_LIVE : SPORTS.slice(0, 4)} landscape />
 <ContentRow title="All Sports" subtitle="Cricket · Football · Boxing & more" items={SPORTS} ranked />
 <ContentRow title="Highlights" subtitle="Best plays of the week" items={SPORTS_HIGHLIGHTS} landscape />
 </CategoryPageShell>
 );
}
