import { useRouter } from 'next/router'; import { Dashboard } from '@/features/console/ConsolePages'; export default function Page(){return <Dashboard state={useRouter().query.state}/>}
