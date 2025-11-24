import Link from 'next/link';
import MainCommandeMenu from './main-command-menu';

const PROJECTS = [
  {
    name: 'SVG Animator',
    description: 'A tool to animate SVGs',
    href: '/svg-animator',
  },
  {
    name: 'Shipment Tracking',
    description: 'A tool to track shipments',
    href: '/shipment-tracking',
  },
];

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <MainCommandeMenu />
      {PROJECTS.map((project) => (
        <Link key={project.href} href={project.href} className="flex flex-col gap-2 border p-4 rounded-md">
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-sm text-gray-500">{project.description}</p>
        </Link>
      ))}
    </div>
  );
}
