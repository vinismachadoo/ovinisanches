'use client';

import React from 'react';

import { MessageCircleMore, ToyBrick, PackageOpen, ListTree } from 'lucide-react';
import { motion } from 'motion/react';
const Presentation = () => {
  const description =
    'I solidify bridges between business, design and engineering teams with my expertise in product development and product lifecycle';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="size-full p-4 gap-y-6 flex flex-col"
    >
      <div className="flex flex-wrap gap-2 [&_span]:text-2xl [&_span]:font-medium [&_span]:leading-none [&_span]:h-7">
        <span>The</span>
        <span>agentic</span>
        <span>way</span>
        <span>of</span>
        <div className="flex items-center justify-center rounded-sm bg-sky-500/20 size-7 p-1">
          <MessageCircleMore className="size-full text-sky-500" />
        </div>
        <span>thinking,</span>
        <div className="flex items-center justify-center rounded-sm bg-pink-500/20 size-7 p-1">
          <ToyBrick className="size-full text-pink-500" />
        </div>
        <span>building,</span>
        <div className="flex items-center justify-center rounded-sm bg-yellow-500/20 size-7 p-1">
          <PackageOpen className="size-full text-yellow-500" />
        </div>
        <span>shipping</span>
        <span>and</span>
        <div className="flex items-center justify-center rounded-sm bg-purple-500/20 size-7 p-1">
          <ListTree className="size-full text-purple-500" />
        </div>
        <span>managing</span>
        <span>products.</span>
      </div>

      <div className="flex flex-wrap gap-2 [&_span]:text-2xl [&_span]:leading-none [&_span]:h-7">
        {description.split(' ').map((word, index) => (
          <span key={index}>{word}</span>
        ))}
      </div>

      <div className="h-full border border-dashed rounded-sm" />

      <div>
        <p className="text-lg">
          Product <span className="line-through decoration-rose-500/60 decoration-double text-lg">Manager</span>{' '}
          Engineer based in Rio de Janeiro, Brazil.
        </p>
      </div>
    </motion.div>
  );
};

export default Presentation;
