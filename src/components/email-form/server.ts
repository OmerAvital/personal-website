import {
  type Input,
  email,
  length,
  toTrimmed,
  minLength,
  object,
  string,
  union,
} from 'valibot';
import { formAction$, valiForm$ } from '@modular-forms/qwik';
import { createServerClient } from 'supabase-auth-helpers-qwik';
import { Resend } from 'resend';

export const EmailSchema = object({
  email: string([
    toTrimmed(),
    minLength(1, 'Please enter your email.'),
    email('The email address is badly formatted.'),
  ]),
  phoneNumber: union(
    [
      string([toTrimmed(), length(0)]),
      string([
        toTrimmed(),
        minLength(10, 'Please enter a 10-digit phone number'),
      ]),
    ],
    'Invalid phone number.',
  ),
  name: string([minLength(1, 'Please enter your name.')]),
  message: string([toTrimmed(), minLength(1, 'Please enter a message.')]),
});

type EmailForm = Input<typeof EmailSchema>;

export const useFormAction = formAction$<EmailForm>(
  async (values, requestEv) => {
    const supabaseClient = createServerClient(
      requestEv.env.get('PUBLIC_SUPABASE_URL')!,
      requestEv.env.get('PUBLIC_SUPABASE_ANON_KEY')!,
      requestEv,
    );

    const { error: dbError } = await supabaseClient.from('Emails').insert({
      email: values.email,
      phone_number: values.phoneNumber || null,
      name: values.name,
      message: values.message,
    });

    const resend = new Resend(requestEv.env.get('RESEND_KEY')!);

    const { error: emailToMeError } = await resend.emails.send({
      from: 'omeravital.dev Email Form <noreply@omeravital.dev>',
      to: 'omer@omeravital.dev',
      reply_to: values.email,
      subject: `Email from <${values.name}> from website form`,
      text:
        (dbError
          ? `Error: ${dbError.message}\n--------------------------\n${dbError.details}\n--------------------------\n\n`
          : '') +
        `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phoneNumber}\n\nMessage:\n--------------------------\n${values.message}\n--------------------------\n`,
    });

    const { error: emailToUserError } = await resend.emails.send({
      from: 'omeravital.dev no-reply <noreply@omeravital.dev>',
      to: values.email,
      subject: `omeravital.dev Email success`,
      text: `Email successfully send to Omer with the following content\n\n--------------------------\nName: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phoneNumber}\n--------------------------\n\n${values.message}`,
    });

    if (emailToMeError || emailToUserError || dbError) {
      return {
        status: 'error',
        message: `1:\n${emailToMeError?.message}\n\n2:\n${emailToUserError?.message}\n\n3:\n${dbError?.message}`,
      };
    }

    return {
      status: 'success',
    };
  },
  valiForm$(EmailSchema),
);
