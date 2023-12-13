import type { ClassList, PropsOf } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';
import type { ExtendProps } from '~/types/extend-props';

export type InputProps = ExtendProps<
  PropsOf<'input'>,
  {
    class?: ClassList;
    error?: string;
  },
  // To fix type errors
  'bind:checked' | 'popovertarget' | 'popovertargetaction'
>;

export const Input = component$<InputProps>(
  ({ class: cn, error, ...props }) => {
    return <input class={['input', error && 'input-error', cn]} {...props} />;
  },
);
