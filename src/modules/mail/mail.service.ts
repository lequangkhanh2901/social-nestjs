import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirm(email: string, token: string) {
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm signup!',
      template: './confirmation',
      context: {
        token,
      },
    })
  }
}
