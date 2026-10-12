'use client'
import { useRouter } from 'next/router';
import { useEdition } from '@/context/EditionContext';
import { useToast } from '@/context/ToastContext';
import HomeHero from '@/components/sections/HomeHero';
import HomeLatest from '@/components/sections/HomeLatest';
import HomeTrending from '@/components/sections/HomeTrending';
import HomeSpotlight from '@/components/sections/HomeSpotlight';
import HomeDiaspora from '@/components/sections/HomeDiaspora';
import HomePicks from '@/components/sections/HomePicks';
import HomeVideos from '@/components/sections/HomeVideos';
import HomeOpportunities from '@/components/sections/HomeOpportunities';
import HomeNominate from '@/components/sections/HomeNominate';
import HomeMostRead from '@/components/sections/HomeMostRead';
import HomeNewsletter from '@/components/sections/HomeNewsletter';

export default function HomePage() {
  const { edition } = useEdition();
  const { toast } = useToast();

  const { query } = useRouter();
  const state = String(query.state || 'default');
  const loading = state === 'loading';
  const sponsored = state === 'sponsored';
  const showTrending = state !== 'hidden';
  const showVideos = state !== 'hidden';

  const handleToast = (msg: string) => {
    toast(msg);
  };

  return (
    <main data-screen-label="Home">
      <HomeHero loading={loading} edition={edition} />
      <HomeLatest loading={loading} edition={edition} sponsored={sponsored} onToast={handleToast} />
      {showTrending && <HomeTrending />}
      <HomeSpotlight loading={loading} />
      <HomeDiaspora loading={loading} edition={edition} />
      <HomePicks loading={loading} edition={edition} />
      {showVideos && <HomeVideos />}
      <HomeOpportunities loading={loading} edition={edition} />
      <HomeNominate />
      <HomeMostRead loading={loading} />
      <HomeNewsletter />
    </main>
  );
}
