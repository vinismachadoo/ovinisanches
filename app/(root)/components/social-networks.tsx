'use client';

import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Check, GithubIcon, InstagramIcon, LinkedinIcon, MailIcon, TwitterIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { toast } from 'sonner';

const SocialNetworks = () => {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const email = 'vinismachado@gmail.com';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center w-full justify-center gap-x-3 **:extend-touch-target"
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => {
          copyToClipboard(email);
          toast.success(`Email '${email}' copied to clipboard`, { position: 'top-center' });
        }}
      >
        {isCopied ? <Check /> : <MailIcon />}
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={<Link href="https://www.linkedin.com/in/vinismachadoo/" target="_blank" rel="noopener noreferrer" />}
        nativeButton={false}
      >
        <LinkedinIcon />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={<Link href="https://github.com/vinismachadoo" target="_blank" rel="noopener noreferrer" />}
        nativeButton={false}
      >
        <GithubIcon />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={<Link href="https://www.instagram.com/ovinisanches" target="_blank" rel="noopener noreferrer" />}
        nativeButton={false}
      >
        <InstagramIcon />
      </Button>

      <Button
        variant="outline"
        size="icon-sm"
        render={<Link href="https://x.com/ovinisanches" target="_blank" rel="noopener noreferrer" />}
        nativeButton={false}
      >
        <TwitterIcon />
      </Button>
    </motion.div>
  );
};

export default SocialNetworks;
