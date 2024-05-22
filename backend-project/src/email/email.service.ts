import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get('nodemailer.server.host'),
      port: configService.get('nodemailer.server.port'),
      secure: false,
      auth: {
        user: configService.get('nodemailer.auth.user'),
        pass: configService.get('nodemailer.auth.pass'),
      },
    });
  }

  async sendEmail({ to, subject, html }: SendMailOptions) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预订系统',
        address: this.configService.get('nodemailer.auth.user'),
      },
      to,
      subject,
      html,
    });
  }
}
