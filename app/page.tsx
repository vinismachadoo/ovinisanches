import { MainCommandMenuContent, MainCommandMenuTrigger } from '@/app/main-command-menu';

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <MainCommandMenuTrigger />
      <MainCommandMenuContent />
    </div>
  );
}
