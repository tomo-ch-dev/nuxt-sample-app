import { Users } from '../../db/entities/Users';
import { UserVerifications } from '../../db/entities/UserVerifications';
import { dataSource } from '../../db/database';
import { sendEmail } from '../../util/sendMail';
import { addDays, format } from 'date-fns';
import crypto from 'crypto';
import logger from '~/logger';
import { RequestEmail, ResponseObject } from '../../../types/index';

export default defineEventHandler(async (event): Promise<ResponseObject> => {
    let response: ResponseObject = { status: false, message: '画面メッセージ' };

    try {
        const userRepository = dataSource.getRepository(Users);
        const { email }: RequestEmail = await readBody(event);
        logger.debug(`${email} のパスワード変更を受け付けています。`);
        const existUser = await userRepository.findOne({
            where: {
                email: email,
                main_regist_flg: true
            }
        });

        if (!existUser) {
            logger.warn(`未知のメールアドレスでのパスワード変更試みです。`);
            response.message = '該当するメールアドレスが見つかりません';
            return response;
        }

        const userVerificationRepository = dataSource.getRepository(UserVerifications);
        const registerToken: string = crypto.randomBytes(16).toString('hex');
        const dateTomorrow: Date = addDays(new Date(), 1);

        const newVerification = userVerificationRepository.create({
            user_id: existUser.id,
            register_token: registerToken,
            token_valid_flg: true,
            token_expire_date: dateTomorrow
        });
        await userVerificationRepository.save(newVerification);
        logger.info(`ユーザーID: ${existUser.id} のパスワード変更を受け付けを完了しました。`);

        //メール送信
        const subject = '【NUXT SAMPLE APP】パスワード変更受付【確認用メール】';
        const html = `<p>以下のURLからパスワードを変更してください。URLは${format(dateTomorrow, 'yyyy/MM/dd HH:mm:ss')}まで有効です。</p><p>${process.env.DOMAIN_URL}/change-password/${registerToken}</p><p>※本メールに心当たりがない場合、お手数ですが破棄してください。</p>`;
        const mailResult: boolean = await sendEmail(email, subject, html);
        logger.info(`メールアドレス ${email} に認証メールを送信しました。`);

        if (!mailResult) {
            response.message = 'パスワード変更確認メールの送信に失敗しました。';
            return response;
        }
        
        response.status = true;
        response.message = 'パスワード変更受け付けを完了しました。確認メールをご確認ください。';
        return response;
    } catch (error) {
        logger.error('パスワード変更受け付け中にエラーが発生しました:', error);
        response.message = 'パスワード変更受け付けに失敗しました。';
        return response;
    }
});