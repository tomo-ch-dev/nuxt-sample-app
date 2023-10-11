import nodemailer from 'nodemailer';
import logger from '~/logger';

export async function sendEmail(email: string, subject: string, html: string): Promise<boolean> {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || '',
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || ''
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: subject,
            html: html
        };

        await transporter.sendMail(mailOptions);
        logger.info(`メールが送信されました`);
        return true;
    } catch (error) {
        logger.error('メールの送信中にエラーが発生しました:', error);
        return false;
    }
};