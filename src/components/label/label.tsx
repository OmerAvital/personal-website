import type { PropsOf } from '@builder.io/qwik';
import { component$, Slot } from '@builder.io/qwik';
import { twMerge, type ClassNameValue } from 'tailwind-merge';
import type { ExtendProps } from '~/types/extend-props';

export type LabelProps = ExtendProps<
  PropsOf<'label'>,
  { class?: ClassNameValue }
>;

export const Label = component$<LabelProps>(({ class: cn, ...props }) => {
  return (
    <label class={twMerge('text-sm font-medium', cn)} {...props}>
      <Slot />
    </label>
  );
});
