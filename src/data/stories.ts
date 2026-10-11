import { Story, Builder, Startup, Opportunity } from '../lib/types';

export const stories: Story[] = [
  { kicker: 'Founder Stories', title: 'Selling More Than Food: How Moses Musioka is Building a Kenyan Brand in Melbourne', summary: 'From a single market stall to supermarket shelves, without losing the taste of home.', author: 'Grace Ochieng', date: '6 Oct 2026', readTime: '6 min read', industry: 'Consumer', country: 'Australia', views: 9200, type: 'Founder Stories', slug: 'moses-musioka-kenyan-brand' , image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80'},
  { kicker: 'Analysis', title: 'Q3 2026: where African venture money went', summary: 'Debt grew, seed rounds shrank, and climate quietly doubled.', author: 'Chioma Eze', date: '5 Oct 2026', readTime: '5 min read', industry: 'Fintech', country: 'Nigeria', views: 14100, type: 'Analysis', slug: 'q3-2026-african-venture-money' , image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'},
  { kicker: 'Interviews', title: 'Selba-Gondoza Luka on building a care network for new arrivals', summary: 'The South Sudanese-Australian nurse turned founder on scale without losing warmth.', author: 'Grace Ochieng', date: '5 Oct 2026', readTime: '10 min read', industry: 'HealthTech', country: 'Australia', views: 6100, type: 'Interviews', slug: 'selba-gondoza-luka-care-network' , image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80'},
  { kicker: 'Business', title: 'Inside the quiet rise of Lagos’ merchant-credit startups', summary: 'Three founders on lending to traders the banks never saw.', author: 'Tunde Bakare', date: '4 Oct 2026', readTime: '7 min read', industry: 'Fintech', country: 'Nigeria', views: 11800, type: 'Business', slug: 'lagos-merchant-credit-startups' , image: 'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=800&q=80'},
  { kicker: 'Diaspora', title: 'From Sudan to the Mayor\'s Office: Mohamed Semra and a New Generation of African-Australian Leadership', summary: 'How a legal-aid lawyer became one of Melbourne’s most visible new councillors.', author: 'Adaeze Nwosu', date: '5 Oct 2026', readTime: '8 min read', type: 'Diaspora', slug: 'mohamed-semra-mayor-office' , image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80'},
  { kicker: 'Diaspora', title: 'From the Mountains of Tigray to an Australian Record: Haftu Strintzos', summary: 'The record-holder on Tigray, Broadmeadows and the exercise book he still trains from.', author: 'Grace Ochieng', date: '6 Oct 2026', readTime: '12 min read', slug: 'haftu-strintzos-australian-record' , image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'},
];

export const builders: Builder[] = [
  { name: 'Haftu Strintzos', classification: 'Professional', location: 'Based in Melbourne, AU', flag: '🇦🇺', headline: 'From Tigray to an Australian marathon record', industry: 'Sport', country: 'Australia' , image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'},
  { name: 'Mohamed Semra', classification: 'Community Leader', location: 'Based in Melbourne, AU', flag: '🇦🇺', headline: "From Sudan to the Mayor's Office", industry: 'Civic', country: 'Australia' , image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80'},
  { name: 'Moses Musioka', classification: 'Entrepreneur', location: 'Based in Melbourne, AU', flag: '🇦🇺', headline: 'Building a Kenyan food brand down under', industry: 'Consumer', country: 'Australia' , image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80'},
];

export const categories = ['Entrepreneurship', 'Technology', 'Diaspora', 'Business', 'Policy'];

export const startups: Startup[] = [
  { name: 'Kora Health', oneLiner: 'Claims automation for West African insurers.', industry: 'HealthTech', stage: 'Seed', flag: '🇳🇬', hq: 'Lagos', country: 'Nigeria' , image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'},
];

export const opportunities: Opportunity[] = [
  { slug: 'catalysr', organisation: 'Catalysr', title: 'Migrant Entrepreneurship Program', type: 'Accelerator', location: 'Melbourne, AU', daysLeft: 12 } as any,
];
