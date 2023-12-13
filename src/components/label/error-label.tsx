import { component$ } from '@builder.io/qwik';
import { twMerge, type ClassNameValue } from 'tailwind-merge';

export type ErrorTextProps = {
  class?: ClassNameValue;
  error: string;
};

export const ErrorLabel = component$<ErrorTextProps>(({ class: cn, error }) => {
  if (!error) {
    return null;
  }

  return (
    <p class={twMerge('text-xs text-red-700', cn)}>
      {error}
    </p>
  );
});
