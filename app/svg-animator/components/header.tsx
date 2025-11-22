import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { MainNav } from '@/app/svg-animator/components/main-nav';
import { Twitter } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b h-14 sticky top-0 left-0 bg-background/80 backdrop-blur-md px-6 py-3">
      <div className="mx-auto flex items-center justify-between">
        <div>
          <MainNav />
        </div>
        <div className="flex items-center gap-x-4">
          <Link target="_blank" href="https://x.com/ovinisanches">
            <Button variant="outline">
              <Twitter className="size-4" />
              Follow on twitter
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
