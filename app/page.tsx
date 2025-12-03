import { MainCommandMenuTrigger } from '@/app/main-command-menu';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Image src="/rio-isometric.png" alt="Logo" width={500} height={500} />
      <MainCommandMenuTrigger />
    </div>
  );
}
