import nodemailer from 'nodemailer';

export default class MailService {
  static async sendActivationMail(to, link) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'code.craft.server2023@gmail.com',
        pass: 'vbwlhedyrlppqyud'
      }
    });

    await transporter.sendMail({
      from: 'code.craft2023@gmail.com',
      to,
      subject: 'Activating an account on the site code-craft.com',
      text: '',
      html:
        `
          <div>
            <h1>To activate your account, follow this link</h1>
            <a href="${link}">${link}</a>
          </div>
        `
    })
  }
}