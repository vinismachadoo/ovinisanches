import { MainCommandMenuContent, MainCommandMenuTrigger } from '@/app/main-command-menu';
import Link from 'next/link';

const PROJECTS = [
  {
    name: 'SVG Animator',
    description: 'A tool to animate SVGs',
    href: '/svg-animator',
  },
  {
    name: 'Shipment Tracking',
    description: 'Track shipments prototype',
    href: '/shipment-tracking',
  },
];

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <MainCommandMenuTrigger />

      <MainCommandMenuContent />
      {PROJECTS.map((project) => (
        <Link key={project.href} href={project.href} className="flex flex-col gap-2 border p-4 rounded-sm">
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-sm text-gray-500">{project.description}</p>
        </Link>
      ))}
    </div>
  );
}
