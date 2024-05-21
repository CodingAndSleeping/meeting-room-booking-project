import { Injectable } from '@nestjs/common';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '1162300237@qq.com',
        pass: '授权码',
      },
    });
  }

  async sendEmail({ to, subject, html }: SendMailOptions) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预订系统',
        address: '1162300237@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
