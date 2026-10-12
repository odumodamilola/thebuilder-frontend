export type Builder = { slug:string; name:string; classification:string; location:string; flag:string; headline:string; industry:string; country:string };
export type Startup = { slug:string; name:string; oneLiner:string; industry:string; stage:string; hq:string; flag:string; founded:number; team:number };
export type Opportunity = { slug:string; type:string; title:string; org:string; location:string; region:string; daysLeft:number; remote?:boolean };

export const builders: Builder[] = [
  {slug:'selba-gondoza-luka',name:'Selba-Gondoza Luka',classification:'Startup Founder',location:'Melbourne, Australia',flag:'🇦🇺',headline:'Building a better first home for new arrivals',industry:'Social Impact',country:'Australia'},
  {slug:'haftu-strintzos',name:'Haftu Strintzos',classification:'Entrepreneur',location:'Melbourne, Australia',flag:'🇦🇺',headline:'Turning experience into an academy for founders',industry:'Technology',country:'Australia'},
  {slug:'mohamed-semra',name:'Mohamed Semra',classification:'Community Leader',location:'Sydney, Australia',flag:'🇦🇺',headline:'Backing migrant founders before anyone else does',industry:'Social Impact',country:'Australia'},
  {slug:'wanjiru-kamau',name:'Wanjiru Kamau',classification:'Startup Founder',location:'Melbourne, Australia',flag:'🇦🇺',headline:'Making remittances work for families',industry:'Fintech',country:'Australia'},
  {slug:'ifeoma-uzo',name:'Ifeoma Uzo',classification:'Professional',location:'Lagos, Nigeria',flag:'🇳🇬',headline:'Building the rails for modern African commerce',industry:'Fintech',country:'Nigeria'},
  {slug:'kojo-mensah',name:'Kojo Mensah',classification:'Investor',location:'Accra, Ghana',flag:'🇬🇭',headline:'Patient capital for underestimated founders',industry:'Finance',country:'Ghana'},
  {slug:'bellamore-ndayikeze',name:'Bellamore Ndayikeze',classification:'Entrepreneur',location:'Melbourne, Australia',flag:'🇦🇺',headline:'Hiring the people others overlook',industry:'Civic',country:'Australia'},
  {slug:'amara-osei',name:'Amara Osei',classification:'Creative',location:'Sydney, Australia',flag:'🇦🇺',headline:'A gallery for West African photography',industry:'Creative',country:'Australia'},
];

export const startups: Startup[] = [
  {slug:'pesa-bridge',name:'Pesa Bridge',oneLiner:'Low-fee remittances from Australia to East Africa, landing in mobile wallets in minutes.',industry:'Fintech',stage:'Seed',hq:'Melbourne, AU',flag:'🇦🇺',founded:2023,team:14},
  {slug:'kazi-pay',name:'Kazi Pay',oneLiner:'Payroll and benefits for Africa’s distributed teams.',industry:'Fintech',stage:'Pre-seed',hq:'Lagos, NG',flag:'🇳🇬',founded:2024,team:9},
  {slug:'ubuntu-rails',name:'Ubuntu Rails',oneLiner:'Trade infrastructure connecting independent African makers to global buyers.',industry:'Commerce',stage:'Seed',hq:'Nairobi, KE',flag:'🇰🇪',founded:2022,team:23},
  {slug:'haven-care',name:'Haven Care',oneLiner:'Culturally aware care navigation for newly arrived families.',industry:'Health',stage:'Growth',hq:'Melbourne, AU',flag:'🇦🇺',founded:2020,team:48},
  {slug:'farmstack',name:'Farmstack',oneLiner:'Market intelligence and working capital for smallholder cooperatives.',industry:'AgriTech',stage:'Series A+',hq:'Accra, GH',flag:'🇬🇭',founded:2019,team:61},
  {slug:'civic-loop',name:'Civic Loop',oneLiner:'Simple digital services for fast-growing African cities.',industry:'Civic',stage:'Idea',hq:'Abuja, NG',flag:'🇳🇬',founded:2026,team:4},
];

export const opportunities: Opportunity[] = [
  {slug:'catalysr-migrant-entrepreneurship',type:'Accelerator',title:'Catalysr Migrant Entrepreneurship Program — Melbourne',org:'Catalysr',location:'Melbourne, AU',region:'Australia',daysLeft:7},
  {slug:'africa-climate-fellowship',type:'Fellowship',title:'Africa Climate Builders Fellowship 2027',org:'Future Africa',location:'Remote · Africa',region:'Africa',remote:true,daysLeft:18},
  {slug:'founding-product-designer',type:'Job',title:'Founding product designer',org:'Kazi Pay',location:'Lagos, NG · Hybrid',region:'Nigeria',daysLeft:25},
  {slug:'creative-economy-grant',type:'Grant',title:'African Creative Economy Grant',org:'Culture Forward',location:'Africa',region:'Africa',daysLeft:31},
];

export const videos = [
  ['Founder interview','Haftu Strintzos: the long way to product-market fit','18:42'],
  ['Explainer','How diaspora angel rounds actually work','08:16'],
  ['Builder profile','Inside Melbourne’s African business corridor','12:05'],
  ['Field notes','What Lagos founders learned from a difficult quarter','09:34'],
  ['Startup story','Pesa Bridge is rebuilding the remittance experience','06:51'],
  ['Events','Osun Tech Exchange 3.0 — highlights','04:28'],
] as const;

