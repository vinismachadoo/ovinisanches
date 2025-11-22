import Link from 'next/link';

export const MainNav = () => {
  return (
    <div className="flex items-center gap-5">
      <Link href={'/'} className="font-semibold">
        SVG animator
      </Link>
    </div>
  );
};
