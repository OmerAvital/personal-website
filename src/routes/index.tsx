import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead, Link } from '@builder.io/qwik-city';
import { type InitialValues } from '@modular-forms/qwik';
import { EmailForm } from '~/components/email-form/email-form';
import {
  GithubLogo,
  InstagramLogo,
  LinkedInLogo,
} from '~/components/Logos/logos';
import GalilElyonLogo from '~/images/galil-elyon-logo.png?jsx';
import GYIScreenshot from '~/images/gap-year-israel-screenshot.png?jsx';
import { WebsiteCard } from '~/components/website-card/website-card';

export const useFormLoader = routeLoader$<InitialValues<EmailForm>>(() => ({
  email: '',
  phoneNumber: '',
  name: '',
  message: '',
}));

export default component$(() => {
  const formLoader = useFormLoader();
  return (
    <>
      <h1 class="text-center text-5xl font-black">Hi, I'm Omer</h1>

      <section class="mx-auto flex w-[calc(100%-2rem)] max-w-3xl flex-col gap-4">
        <h2 class="text-3xl font-bold">My creation.</h2>
        <WebsiteCard
          stack={['next', 'tailwind', 'cloudinary', 'cloudflare']}
          title="Upper Galilee Leadership Academy Website"
          link="gap-year-israel.org"
          href="https://gap-year-israel.org/en"
        >
          <GalilElyonLogo
            q:slot="icon"
            alt="Upper Galilee Leadership Academy logo"
          />
          <GYIScreenshot q:slot="screenshot" />
        </WebsiteCard>
      </section>

      <section class="mx-auto flex w-[calc(100%-2rem)] max-w-3xl flex-col gap-4">
        <h2 class="text-3xl font-bold">Find me online.</h2>
        <div class="flex gap-2">
          <Link
            class="block h-16 w-16 rounded-2xl border-2 border-current p-3 text-indigo-700 backdrop-blur-sm transition-colors duration-300 hover:bg-indigo-700/80 hover:text-slate-50 dark:text-indigo-500 dark:hover:text-indigo-200"
            href="https://github.com/OmerAvital"
            target="_blank"
          >
            <span class="sr-only">Github page</span>
            <GithubLogo />
          </Link>
          <Link
            class="block h-16 w-16 rounded-2xl border-2 border-current p-3 text-indigo-700 backdrop-blur-sm transition-colors duration-300 hover:bg-indigo-700/80 hover:text-slate-50 dark:text-indigo-500 dark:hover:text-indigo-200"
            href="https://instagram.com/realomeravital"
            target="_blank"
          >
            <span class="sr-only">Linked In</span>
            <LinkedInLogo />
          </Link>
          <Link
            class="block h-16 w-16 rounded-2xl border-2 border-current p-3 text-indigo-700 backdrop-blur-sm transition-colors duration-300 hover:bg-indigo-700/80 hover:text-slate-50 dark:text-indigo-500 dark:hover:text-indigo-200"
            href="https://instagram.com/realomeravital"
            target="_blank"
          >
            <span class="sr-only">Instagram</span>
            <InstagramLogo />
          </Link>
        </div>
      </section>

      <section class="mx-auto flex w-[calc(100%-2rem)] max-w-3xl flex-col gap-4">
        <h2 class="text-3xl font-bold">Send me a message.</h2>
        <EmailForm loader={formLoader} />
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Omer Avital',
  meta: [
    {
      name: 'description',
      content: "Omer Avital's personal website",
    },
  ],
};
