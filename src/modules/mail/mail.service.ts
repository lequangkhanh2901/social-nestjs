import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirm(
    email: string,
    token: string,
    type: 'signup' | 'forgot_password' = 'signup',
  ) {
    const subject =
      type === 'forgot_password' ? 'Forgot password' : 'Confirm signup!'
    const template =
      type === 'forgot_password' ? './forgotpassword' : './signup'
    return await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        url: `${process.env.FE_BASE_URL}/signup/confirm/${token}`,
      },
    })
  }
}
