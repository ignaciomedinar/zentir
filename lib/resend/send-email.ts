import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Zentir <noreply@zentir.com>",
    to,
    subject,
    html,
  });
}
