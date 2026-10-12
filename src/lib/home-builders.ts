import type { Builder } from './types'

// Reference fixtures; replace this record with the homepage API response.
type Profile = [string, Builder['classification'], string, string, string, string]
const profiles: Record<string, Profile[]> = {
  UK: [
    ['Ngozi Adeyemi', 'Investor', 'London', 'UK', '🇬🇧', 'Backing diaspora founders at pre-seed'],
    ['Kwame Asante', 'Innovator', 'Manchester', 'UK', '🇬🇧', 'Battery recycling from e-waste'],
    ['Amina Bello', 'Diaspora Professional', 'Leeds', 'UK', '🇬🇧', 'NHS data lead, Abuja health advisor'],
    ['Femi Ogunleye', 'Creative', 'London', 'UK', '🇬🇧', 'An Afro-futurist design studio'],
  ],
  US: [
    ['Chidi Okafor', 'Startup Founder', 'Houston', 'US', '🇺🇸', 'Logistics software for Gulf Coast ports'],
    ['Halima Yusuf', 'Investor', 'New York', 'US', '🇺🇸', 'A seed fund for African fintech'],
    ['Tobi Adebayo', 'Professional', 'Seattle', 'US', '🇺🇸', 'Cloud architect mentoring engineers in Lagos'],
    ['Grace Mensah', 'Academic', 'Atlanta', 'US', '🇺🇸', 'Public-health research across two continents'],
  ],
  Canada: [
    ['Emeka Nwachukwu', 'Innovator', 'Toronto', 'CA', '🇨🇦', 'Water sensors for Lagos estates'],
    ['Fatima Diallo', 'Community Leader', 'Montréal', 'CA', '🇨🇦', 'A francophone network for African newcomers'],
    ['Yinka Balogun', 'Entrepreneur', 'Calgary', 'CA', '🇨🇦', 'Halal meal kits across the Prairies'],
    ['Samuel Tesfaye', 'Professional', 'Vancouver', 'CA', '🇨🇦', 'Product lead at a climate-data firm'],
  ],
  Australia: [
    ['Haftu Strintzos', 'Professional', 'Melbourne', 'AU', '🇦🇺', 'From Tigray to an Australian marathon record'],
    ['Mohamed Semra', 'Community Leader', 'Melbourne', 'AU', '🇦🇺', "From Sudan to the Mayor's Office"],
    ['Moses Musioka', 'Entrepreneur', 'Melbourne', 'AU', '🇦🇺', 'Building a Kenyan food brand down under'],
    ['Selba-Gondoza Luka', 'Startup Founder', 'Melbourne', 'AU', '🇦🇺', 'A care network for new arrivals'],
  ],
  Europe: [
    ['Aisha Bangura', 'Startup Founder', 'Berlin', 'DE', '🇩🇪', 'A remittance API for EU–Africa corridors'],
    ['Olumide Akinola', 'Investor', 'Amsterdam', 'NL', '🇳🇱', 'Bringing Dutch agri-capital to Nigeria'],
    ['Marie-Claire Habimana', 'Creative', 'Paris', 'FR', '🇫🇷', 'Rwandan textiles on Paris runways'],
    ['Kofi Boateng', 'Innovator', 'Lisbon', 'PT', '🇵🇹', 'Solar cold chains for fisheries'],
  ],
  'Middle East': [
    ['Ibrahim Sule', 'Professional', 'Dubai', 'AE', '🇦🇪', 'Trade finance between Dubai and Kano'],
    ['Zainab Lawal', 'Entrepreneur', 'Doha', 'QA', '🇶🇦', 'A beauty brand made for desert heat'],
    ['Daniel Kariuki', 'Startup Founder', 'Riyadh', 'SA', '🇸🇦', 'HR software for migrant workers'],
    ['Ngozi Eze', 'Diaspora Professional', 'Abu Dhabi', 'AE', '🇦🇪', 'Hospital operations lead, Abuja board advisor'],
  ],
  Africa: [
    ['Adaora Mba', 'Startup Founder', 'Nairobi', 'KE', '🇰🇪', 'Pan-African payroll from Nairobi'],
    ['Kwesi Owusu', 'Entrepreneur', 'Accra', 'GH', '🇬🇭', 'Cocoa processing that stays local'],
    ['Thandiwe Dlamini', 'Investor', 'Johannesburg', 'ZA', '🇿🇦', 'Backing Nigerian founders in South Africa'],
    ['Bayo Ogundipe', 'Innovator', 'Kigali', 'RW', '🇷🇼', 'Drone mapping for land titles'],
  ],
  Asia: [
    ['Chinedu Obi', 'Entrepreneur', 'Guangzhou', 'CN', '🇨🇳', 'Fair sourcing for Lagos retailers'],
    ['Rahma Abubakar', 'Academic', 'Tokyo', 'JP', '🇯🇵', 'Robotics research and Kano STEM camps'],
    ['Victor Eze', 'Professional', 'Singapore', 'SG', '🇸🇬', 'Fintech compliance across ASEAN and ECOWAS'],
    ['Ama Darko', 'Creative', 'Seoul', 'KR', '🇰🇷', 'Where Afrobeats meets K-pop production'],
  ],
}

export const homeBuilders: Record<string, Builder[]> = Object.fromEntries(
  Object.entries(profiles).map(([region, entries]) => [region, entries.map(([name, classification, city, country, flag, headline]) => ({
    name, classification, city, country, flag, headline, location: `Based in ${city}, ${country}`,
    imageAlt: `Portrait of ${name}`,
  }))]),
)
