import type { ClassList, PropsOf } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';
import type { ExtendProps } from '~/types/extend-props';

export type TextareaProps = ExtendProps<
  PropsOf<'textarea'>,
  {
    class?: ClassList;
    error?: string;
  }
>;

export const Textarea = component$<TextareaProps>(
  ({ class: cn, error, ...props }) => {
    return (
      <textarea class={['input', error && 'input-error', cn]} {...props} />
    );
  },
);
