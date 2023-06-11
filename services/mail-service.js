import nodemailer from 'nodemailer';

export default class MailService {
  static async sendActivationMail(to, link) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Activating an account on the site code-craft.com',
      text: '',
      html: `
          <div>
            <h1>To activate your account, follow this link</h1>
            <a href="${link}">${link}</a>
          </div>
        `,
    });
  }
}
