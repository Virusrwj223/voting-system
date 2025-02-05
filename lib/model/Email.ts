import { Resend } from 'resend';

export abstract class Email {
  protected sender;
  constructor(sender: string) {
    this.sender = sender;
  }
  abstract sendMail(
    receipients: string[],
    subject: string,
    body: string,
    html: string,
  ): Promise<void>;
}

export class Gmail extends Email {
  private transport;
  constructor(sender: string, password: string) {
    super(sender);
    this.transport = new Resend(password);
  }
  async sendMail(receipients: string[], subject: string, html: string) {
    for (let i = 0; i < receipients.length; i++) {
      await this.transport.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: receipients,
        subject: subject,
        html: html,
      });
    }
  }
}
