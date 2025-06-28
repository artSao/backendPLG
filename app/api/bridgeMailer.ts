import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `https://96l0c2mg-3000.asse.devtunnels.ms/reset-password?token=${token}`;

  // siapkan transporter untuk mengirim email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Set up the email data
  const mailOptions = {
    from: `"Pecel Lele Connect" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    text: `Hi,\nYou requested a password reset. Please click the link below to reset your password:\n${resetUrl}\nIf you didn’t request this, you can ignore this message.\nThis link will expire in 1 hour.\nIf you have any questions, feel free to reach out to us.\nThank you for using Pecel Lele Connect!\nBest regards,\nPecel Lele Connect Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
