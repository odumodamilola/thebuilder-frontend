import { useRouter } from 'next/router'; import { EditorPage } from '@/features/console/ConsolePages'; export default function Page(){return <EditorPage state={useRouter().query.state}/>}
