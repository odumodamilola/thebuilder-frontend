import { useRouter } from 'next/router'
import { StoriesPage, type PageState } from '@/features/editorial/EditorialPages'
const states: PageState[] = ['default','loading','empty','error','subcategory','empty-tab','sponsored','comments-soon','404']
export default function StoriesRoute(){ const { query }=useRouter(); const requested=String(query.state||'default'); return <StoriesPage state={states.includes(requested as PageState)?requested as PageState:'default'}/> }
