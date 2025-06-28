import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// POST /api/contact
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Basic validation
    if (
      !name ||
      typeof name !== "string" ||
      !email ||
      typeof email !== "string" ||
      !message ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "All fields are required and must be strings." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAILGUN_HOST!,
      port: Number(process.env.MAILGUN_PORT!),
      auth: {
        user: process.env.MAILGUN_USER!,
        pass: process.env.MAILGUN_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.MAILGUN_USER}>`,
      to: process.env.CONTACT_EMAIL!,
      subject: `New message from ${name}`,
      html: `<p><strong>Sender Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return NextResponse.json({ success: true , message: "Your message send to akshay raj successfully!" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Mailgun error:", error);
    }
    return NextResponse.json(
      { success: false, error: "Email sending failed" },
      { status: 500 }
    );
  }
}

