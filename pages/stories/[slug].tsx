import { useRouter } from 'next/router'
import { ArticlePage, type PageState } from '@/features/editorial/EditorialPages'
const states: PageState[] = ['default','loading','empty','error','subcategory','empty-tab','sponsored','comments-soon','404']
export default function ArticleRoute(){ const { query }=useRouter(); const requested=String(query.state||'default'); return <ArticlePage state={states.includes(requested as PageState)?requested as PageState:'default'}/> }
