import type { ClassList, PropsOf } from '@builder.io/qwik';
import { component$, Slot } from '@builder.io/qwik';
import type { ExtendProps } from '~/types/extend-props';

export type InputWrapperProps = ExtendProps<
  PropsOf<'div'>,
  { class?: ClassList }
>;

export const InputWrapper = component$<InputWrapperProps>(
  ({ class: cn, ...props }) => {
    return (
      <div class={['input-wrapper', cn]} {...props}>
        <Slot />
      </div>
    );
  },
);
