import Link from 'next/link';

const PROJECTS = [
  {
    name: 'SVG Animator',
    description: 'A tool to animate SVGs',
    href: '/svg-animator',
  },
];

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-col gap-4">
        {PROJECTS.map((project) => (
          <Link key={project.href} href={project.href} className="flex flex-col gap-2 border p-4 rounded-md">
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <p className="text-sm text-gray-500">{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
