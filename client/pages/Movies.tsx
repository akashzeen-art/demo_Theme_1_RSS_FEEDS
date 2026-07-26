import { CategoryPageShell } from '@/components/CategoryPageShell';
import { ContentRow } from '@/components/ContentRow';
import { CategoryPageRss, CategorySisterLinks } from '@/sections/HomeCategoryRss';
import { MOVIES, MOVIES_ACTION, MOVIES_CLASSICS, MOVIES_TRENDING } from '@/lib/catalog';

export default function Movies() {
 return (
 <CategoryPageShell
 badge="Cinema"
 title="Movies"
 subtitle="Blockbusters, thrillers and must-watch films — plus live RSS trailers & clips."
 heroImage="/landscape_new_desicontent/1.png"
 >
 <CategorySisterLinks current="movies" />
 <CategoryPageRss categoryId="movies" />
 <ContentRow title="Trending Movies" subtitle="What everyone is watching" items={MOVIES_TRENDING} ranked />
 <ContentRow title="Action & Thrillers" subtitle="High-octane picks" items={MOVIES_ACTION} />
 <ContentRow title="All Movies" subtitle="Browse the full catalog" items={MOVIES} />
 <ContentRow title="More to Explore" subtitle="Critics & classics vibes" items={MOVIES_CLASSICS} landscape />
 </CategoryPageShell>
 );
}
