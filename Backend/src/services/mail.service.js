import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {
  try {
    const details = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
      text,
    });
    console.log("📩 Email sent:", details);
    return details;
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    throw err;
  }
}