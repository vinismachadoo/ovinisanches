import { MainCommandMenuTrigger } from '@/app/main-command-menu';
import Image from 'next/image';
import Link from 'next/link';

const PAGES = [
  {
    id: 'places',
    title: 'My footprint',
    description: 'página dedicada aos lugares favoritos que já visitei',
    href: '/places',
    icon: '🌍',
  },
  {
    id: 'tv',
    title: 'Histórico de filmes e séries assistidos',
    description: 'página dedicada ao histórico de filmes e séries assistidos',
    href: '/tv',
    icon: '🎥',
  },
  {
    id: 'design',
    title: 'Design',
    description: 'página dedicada ao design',
    href: '/design',
    icon: '🎨',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Image src="/rio-isometric.png" alt="Logo" width={500} height={500} />
      <MainCommandMenuTrigger />

      <div className="grid grid-cols-3 gap-4">
        {PAGES.map((page) => (
          <Link href={page.href} key={page.id}>
            <div key={page.id} className="flex flex-col items-center justify-center border">
              <h2 className="text-lg font-bold">{page.title}</h2>
              <p className="text-sm text-muted-foreground">{page.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
