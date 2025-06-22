import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  if (
    !process.env.MAILGUN_HOST ||
    !process.env.MAILGUN_PORT ||
    !process.env.MAILGUN_USER ||
    !process.env.MAILGUN_PASS
  ) {
    throw new Error('Mailgun credentials are not set in environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_HOST,
    port: Number(process.env.MAILGUN_PORT),
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Portfolio Admin" <${process.env.MAILGUN_USER}>`,
    to: email,
    subject: 'Your Admin OTP Code',
    html: `
      <div>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  });
}
