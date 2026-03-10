'use client';

import { cn } from '@/lib/utils';
import { motion, Variants } from 'motion/react';

const container: Variants = {
  initial: {},
  animate: {},
};

const createDrawVariant = (index: number): Variants => ({
  initial: {
    opacity: 0,
    pathLength: 0,
  },
  animate: {
    opacity: 1,
    pathLength: 1,
    transition: {
      opacity: {
        duration: 0.01,
        delay: PATH_DELAYS[index],
      },
      pathLength: {
        ease: [0.4, 0, 0.2, 1],
        duration: PATH_DURATIONS[index],
        delay: PATH_DELAYS[index],
      },
    },
  },
});

const PATH_DURATIONS = [0.4, 0.08, 0.15, 0.08, 0.15, 0.08, 0.15, 0.15, 0.4, 0.15, 0.15, 0.15, 0.15, 0.15, 0.15];

const PATH_DELAYS = PATH_DURATIONS.reduce<number[]>(
  (acc, _, i) => [...acc, i === 0 ? 0 : acc[i - 1] + PATH_DURATIONS[i - 1]],
  [],
);

const MotionSignature = () => {
  return (
    <div className="flex items-center justify-center gap-x-6 px-2 text-muted-foreground relative p-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-6 left-0 w-full h-px bg-muted-foreground/20"
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center absolute bottom-1 left-0 w-full text-xs"
      >
        Made by
      </motion.div>

      <div
        className={cn(
          'flex items-center justify-center',
          // gather letters
          '**:-ms-1 **:not-first:mt-9',
          // V
          '**:first:-me-6',
          // s
          '**:last:-ms-2',
        )}
        id="Vinicius"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 41 51"
          height="51"
          width="41"
          variants={container}
          initial="initial"
          animate="animate"
          id="v-up"
        >
          <motion.path
            d="M17.7137 11.0771C1.95501 41.7408 0.214021 47.5771 2.71479 48.0771C5.21556 48.5771 21.7148 24.0771 39.2137 3.07715"
            variants={createDrawVariant(0)}
          />
        </motion.svg>

        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 9 51"
          height="51"
          width="9"
          variants={container}
          initial="initial"
          animate="animate"
          id="i-lo"
        >
          <motion.path
            d="M3.7548 22.9229C2.60207 23.529 -0.752212 29.5295 1.61166 28.7618C3.97553 27.994 5.61205 25.8726 7.67374 24.721"
            stroke="currentColor"
            variants={createDrawVariant(1)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 15 51"
          height="51"
          width="15"
          variants={container}
          initial="initial"
          animate="animate"
          id="n-lo"
        >
          <motion.path
            d="M4.42188 23.1724L1.16211 28.4658C3.87099 25.9122 7.65167 23.2024 8.42922 23.7108C8.87781 23.9799 6.69468 26.9705 7.8311 27.4191C8.96753 27.8677 11.8983 25.565 14.0814 24.7575"
            stroke="currentColor"
            variants={createDrawVariant(2)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 9 51"
          height="51"
          width="9"
          variants={container}
          initial="initial"
          animate="animate"
          id="i-lo"
        >
          <motion.path
            d="M3.7548 22.9229C2.60207 23.529 -0.752212 29.5295 1.61166 28.7618C3.97553 27.994 5.61205 25.8726 7.67374 24.721"
            stroke="currentColor"
            variants={createDrawVariant(3)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 11 51"
          height="51"
          width="11"
          variants={container}
          initial="initial"
          animate="animate"
          id="c-lo"
        >
          <motion.path
            d="M5.63386 24.0707C5.12282 21.6404 0.607995 27.2758 1.82723 28.005C3.15925 28.5935 9.75939 24.6736 9.75939 24.6736"
            stroke="currentColor"
            variants={createDrawVariant(4)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 9 51"
          height="51"
          width="9"
          variants={container}
          initial="initial"
          animate="animate"
          id="i-lo"
        >
          <motion.path
            d="M3.7548 22.9229C2.60207 23.529 -0.752212 29.5295 1.61166 28.7618C3.97553 27.994 5.61205 25.8726 7.67374 24.721"
            stroke="currentColor"
            variants={createDrawVariant(5)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 13 51"
          height="51"
          width="13"
          variants={container}
          initial="initial"
          animate="animate"
          id="u-lo"
        >
          <motion.path
            d="M4.02467 23.277C3.02512 22.8065 0.89338 26.614 1.20215 28.0439C1.51091 29.4737 7.5177 23.0864 7.5177 23.0864C7.5177 23.0864 4.71947 27.0005 5.80301 28.3576C6.96087 28.8941 10.5935 24.8364 11.7727 24.2932"
            stroke="currentColor"
            variants={createDrawVariant(6)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 51"
          height="51"
          width="14"
          variants={container}
          initial="initial"
          animate="animate"
          id="s-lo"
        >
          <motion.path
            d="M8.95035 23.3347C8.289 21.833 5.66489 23.7794 5.71956 28.8314C5.77422 33.8834 1.12107 35.424 0.98514 33.3617C0.883641 31.4008 3.52325 32.4975 12.6583 24.7513"
            stroke="currentColor"
            variants={createDrawVariant(7)}
          />
        </motion.svg>
      </div>

      <div
        className={cn(
          'flex items-center justify-center',
          // gather letters
          '**:-ms-1 **:not-first:mt-9',
          // V
          '**:first:-me-4',
          // s
          '**:last:-ms-4',
        )}
        id="Sanches"
      >
        <motion.svg
          fill="none"
          stroke="currentColor"
          height="51"
          width="46"
          variants={container}
          initial="initial"
          animate="animate"
          id="s-up"
        >
          <motion.path
            d="M44.435 9.39728C49.435 -5.10286 -4.56457 25.3972 1.43476 32.8973C6.23411 38.8972 25.0605 38.3972 24.4355 40.8972C23.8105 43.3972 10.9355 44.8972 7.93479 42.8973"
            stroke="currentColor"
            variants={createDrawVariant(8)}
          />
        </motion.svg>

        <motion.svg
          fill="none"
          viewBox="0 0 13 51"
          height="51"
          width="13"
          variants={container}
          initial="initial"
          animate="animate"
          id="a-lo"
        >
          <motion.path
            d="M5.99958 25C5.73591 21.1582 1.99899 25.5 1.49941 28C1.00013 30.5 7.65454 23.3545 7.65454 23.3545C3.5802 27.3691 3.29278 30.5313 4.09638 30.7478C5.08629 31.0263 12.2012 24.7466 12.2012 24.7466"
            stroke="currentColor"
            variants={createDrawVariant(9)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 15 51"
          height="51"
          width="15"
          variants={container}
          initial="initial"
          animate="animate"
          id="n-lo"
        >
          <motion.path
            d="M4.42188 23.1724L1.16211 28.4658C3.87099 25.9122 7.65167 23.2024 8.42922 23.7108C8.87781 23.9799 6.69468 26.9705 7.8311 27.4191C8.96753 27.8677 11.8983 25.565 14.0814 24.7575"
            stroke="currentColor"
            variants={createDrawVariant(10)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 11 51"
          height="51"
          width="11"
          variants={container}
          initial="initial"
          animate="animate"
          id="c-lo"
        >
          <motion.path
            d="M5.63386 24.0707C5.12282 21.6404 0.607995 27.2758 1.82723 28.005C3.15925 28.5935 9.75939 24.6736 9.75939 24.6736"
            stroke="currentColor"
            variants={createDrawVariant(11)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 51"
          height="51"
          width="18"
          variants={container}
          initial="initial"
          animate="animate"
          id="h-lo"
        >
          <motion.path
            d="M14.75 6.08472C8.75724 15.6124 5.74081 20.6113 1.16797 28.7222C2.27051 26.7174 7.40879 23.7648 9.19185 23.8223C10.4381 23.8798 8.46919 26.815 9.75037 27.5733C11.2054 28.4346 16.3726 24.6677 16.3726 24.6677"
            stroke="currentColor"
            variants={createDrawVariant(12)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 51"
          height="51"
          width="18"
          variants={container}
          initial="initial"
          animate="animate"
          id="e-lo"
        >
          <motion.path
            d="M3.07713 25.3392C3.03314 27.7282 6.78706 24.9554 6.03999 23.505C4.44172 21.2653 -0.294204 28.3892 2.71291 28.2186C5.35941 27.9626 10.2422 24.7207 10.2422 24.7207"
            stroke="currentColor"
            variants={createDrawVariant(13)}
          />
        </motion.svg>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 51"
          height="51"
          width="14"
          variants={container}
          initial="initial"
          animate="animate"
          id="s-lo"
        >
          <motion.path
            d="M8.95035 23.3347C8.289 21.833 5.66489 23.7794 5.71956 28.8314C5.77422 33.8834 1.12107 35.424 0.98514 33.3617C0.883641 31.4008 3.52325 32.4975 12.6583 24.7513"
            stroke="currentColor"
            variants={createDrawVariant(14)}
          />
        </motion.svg>
      </div>
    </div>
  );
};

export default MotionSignature;
