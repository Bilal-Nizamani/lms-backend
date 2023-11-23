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
    const { SMPT_HOST, SMPT_PORT, SMPT_SERVICE, SMPT_MAIL, SMPT_PASSWORD } =
      process.env;

    const transporter: Transporter = nodemailer.createTransport({
      host: SMPT_HOST,
      port: SMPT_PORT || 465,
      service: SMPT_SERVICE,
      secure: true,
      auth: {
        user: SMPT_MAIL,
        pass: SMPT_PASSWORD,
      },
    } as TransportOptions);

    const { email, subject, template, data } = options;

    const templatePath = path.join(__dirname, "../mails", template);
    const html: string = await ejs.renderFile(templatePath, data);
    await transporter.sendMail({
      from: SMPT_MAIL,
      to: email,
      subject: subject,
      html: html,
    });
    console.log("email sent");
  } catch (err: any) {
    console.log(err);
  }
};
export default sendMail;
