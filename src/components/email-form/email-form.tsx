import { component$, type Signal, useSignal, useTask$ } from '@builder.io/qwik';
import {
  type InitialValues,
  reset,
  useForm,
  valiForm$,
} from '@modular-forms/qwik';
import { EmailSchema, useFormAction } from './server';
import { type Input as TInput } from 'valibot';
import { Label } from '~/components/label/label';
import { Input } from '~/components/input/input';
import { Textarea } from '~/components/input/textarea';
import { ErrorLabel } from '~/components/label/error-label';
import { InputWrapper } from '~/components/input/input-wrapper';

export type EmailForm = TInput<typeof EmailSchema>;

export type EmailFormProps = {
  loader: Readonly<Signal<InitialValues<EmailForm>>>;
};

export const EmailForm = component$<EmailFormProps>(({ loader }) => {
  const [emailForm, { Form, Field }] = useForm<EmailForm>({
    loader,
    action: useFormAction(),
    validate: valiForm$(EmailSchema),
    validateOn: 'blur',
  });
  const errorDialogRef = useSignal<HTMLDialogElement>();

  useTask$(({ track }) => {
    track(() => errorDialogRef);
    const status = track(() => emailForm.response.status);

    if (status === 'success') {
      setTimeout(() => {
        reset(emailForm);
      }, 2000);
      return;
    }

    if (status === 'error') {
      // eslint-disable-next-line no-console
      console.error(emailForm.response.message);
      errorDialogRef.value?.showModal();
    }
  });

  return (
    <>
      <Form class="flex flex-col gap-6 rounded-xl border bg-slate-50 p-8 text-slate-800 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-200">
        <div class="flex flex-col gap-4 sm:flex-row">
          <div class="flex max-w-[30ch] grow flex-col gap-4">
            <Field name="email">
              {(field, props) => (
                <InputWrapper class="">
                  <Label for={field.name}>Email</Label>
                  <Input
                    {...props}
                    type="email"
                    autoComplete="email"
                    value={field.value}
                    id={field.name}
                    error={field.error}
                    required
                  />
                  <ErrorLabel error={field.error} />
                </InputWrapper>
              )}
            </Field>
            <Field name="phoneNumber">
              {(field, props) => (
                <InputWrapper class="">
                  <Label for={field.name}>
                    Phone Number{' '}
                    <span class="text-xs opacity-50">(optional)</span>
                  </Label>
                  <Input
                    {...props}
                    type="tel"
                    autoComplete=""
                    value={field.value}
                    id={field.name}
                    error={field.error}
                    required={false}
                  />
                  <ErrorLabel error={field.error} />
                </InputWrapper>
              )}
            </Field>
            <Field name="name">
              {(field, props) => (
                <InputWrapper class="">
                  <Label for={field.name}>Name</Label>
                  <Input
                    {...props}
                    type="text"
                    autoComplete="name"
                    value={field.value}
                    id={field.name}
                    error={field.error}
                    required
                  />
                  <ErrorLabel error={field.error} />
                </InputWrapper>
              )}
            </Field>
          </div>
          <Field name="message">
            {(field, props) => (
              <InputWrapper class="grow">
                <Label for={field.name}>Message</Label>
                <Textarea
                  {...props}
                  value={field.value}
                  id={field.name}
                  error={field.error}
                  rows={4}
                  required
                />
                <ErrorLabel error={field.error} />
              </InputWrapper>
            )}
          </Field>
        </div>

        {(() => {
          if (emailForm.response.status === 'success') {
            return (
              <p class="mt-4 text-center text-sm text-green-700 sm:col-span-2">
                Message sent!
              </p>
            );
          }

          return emailForm.submitting ? (
            <p class="mt-4 text-center text-sm text-slate-700 sm:col-span-2">
              Sending message...
            </p>
          ) : (
            <button
              type="submit"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-slate-100 dark:bg-indigo-700 sm:col-span-2"
            >
              Let's Talk
            </button>
          );
        })()}
      </Form>

      <dialog ref={errorDialogRef} class="error-dialog">
        <button
          autoFocus
          onClick$={() => errorDialogRef.value?.close()}
          class="grid h-5 w-5 place-items-center rounded-full border border-current"
        >
          ×
        </button>
        <h2 class="text-center text-2xl font-bold">Error</h2>
        <p class="my-2">
          An error has occured. Please try again in a couple of minutes.
        </p>
      </dialog>
    </>
  );
});
