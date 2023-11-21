import nodemailer, { Transporter, TransportOptions } from "nodemailer";
import ejs from "ejs";
import path from "path";
require("dotenv").config();

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT || 465,
      service: process.env.SMPT_SERVICE,
      secure: true,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    } as TransportOptions);

    const { email, subject, template, data } = options;

    const templatePath = path.join(__dirname, "../mails", template);
    const html: string = await ejs.renderFile(templatePath, data);
    await transporter.sendMail({
      from: process.env.SMPT_MAIL,
      to: email,
      subject: subject,
      html: html,
    });
  } catch (err: any) {
    console.log(err);
  }
};
export default sendMail;
