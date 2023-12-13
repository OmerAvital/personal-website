import { component$, Slot } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import {
  CloudflareLogo,
  CloudinaryLogo,
  NextLogo,
  TailwindLogo,
} from '~/components/Logos/logos';

type DevTools = 'next' | 'tailwind' | 'cloudinary' | 'cloudflare';

export interface WebsiteCardProps {
  title: string;
  href: string;
  link?: string;
  stack: DevTools[];
}

const DEV_TOOL_CLASS = 'h-3 w-auto transition-transform hover:scale-105';

export const WebsiteCard = component$<WebsiteCardProps>(
  ({ stack, title, href, link }) => {
    return (
      <div class="group grid grid-rows-1 overflow-hidden rounded-xl border bg-slate-50 text-slate-800 shadow-md shadow-slate-400/5 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:shadow-slate-950/25 sm:grid-cols-[2fr_1fr]">
        <div class="flex flex-col items-center gap-6 py-3 pe-4 ps-4">
          <div class="flex w-full items-center justify-between gap-6">
            <div class="website-card__icon-wrapper">
              <Slot name="icon" />
            </div>

            <div class="text-right leading-tight">
              <p class="text-lg font-semibold text-indigo-700 dark:text-indigo-500">
                {title}
              </p>
              <Link class="text-sm underline" href={href} target="_blank">
                {link ?? href}
              </Link>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="sr-only">
              NextJS, Twailwind, Cloudinary, Cloudflare Pages
            </span>
            <div class="flex w-fit flex-wrap items-center justify-center gap-6 text-slate-500">
              {stack.includes('next') && <NextLogo class={DEV_TOOL_CLASS} />}
              {stack.includes('tailwind') && (
                <TailwindLogo class={DEV_TOOL_CLASS} />
              )}
              {stack.includes('cloudinary') && (
                <CloudinaryLogo class={DEV_TOOL_CLASS} />
              )}
              {stack.includes('cloudflare') && (
                <CloudflareLogo class={DEV_TOOL_CLASS} />
              )}
            </div>
          </div>
        </div>
        <div class="website-card__screenshot-wrapper h-full w-full overflow-hidden">
          <Slot name="screenshot" />
        </div>
      </div>
    );
  },
);
