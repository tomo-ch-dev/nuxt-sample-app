import { Users } from '../../db/entities/Users';
import { UserVerifications } from '../../db/entities/UserVerifications';
import { dataSource } from '../../db/database';
import { sendEmail } from '../../util/sendMail';
import { addDays, format } from 'date-fns';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import logger from '~/logger';
import { RequestBodyObject, ResponseObject } from '../../../types/index';

export default defineEventHandler(async (event): Promise<ResponseObject> => {
    let response: ResponseObject = { status: false, message: '画面メッセージ' };

    try {
        const userRepository = dataSource.getRepository(Users);
        const { email, password }: RequestBodyObject = await readBody(event);
        const existingUsers: Users[] = await userRepository.find({
            where:
            {
                email: email,
                main_regist_flg: true
            }
        });

        if (existingUsers.length > 0) {
            logger.warn(`メールアドレス ${email} は既に登録されています。`);
            response.message = 'すでに登録されたメールアドレスです。';
            return response;
        }

        /* パスワード暗号化 */
        const hash: string = bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));

        //ユーザー仮登録
        const newUser: Users = userRepository.create({ email: email, password: hash, main_regist_flg: false });
        const saveUser: Users = await userRepository.save(newUser);

        const userVerificationRepository = dataSource.getRepository(UserVerifications);
        const registerToken: string = crypto.randomBytes(16).toString('hex');
        const dateTomorrow: Date = addDays(new Date(), 1);

        const newVerification: UserVerifications = userVerificationRepository.create({
            user_id: saveUser.id,
            register_token: registerToken,
            token_valid_flg: true,
            token_expire_date: dateTomorrow
        });

        await userVerificationRepository.save(newVerification);
        logger.info(`ユーザーID: ${saveUser.id} の仮登録を完了しました。`);

        //メール送信
        const subject: string = '【NUXT SAMPLE APP】ユーザー仮登録【確認用メール】';
        const html: string = `<p>以下のURLからユーザー登録を完了してください。URLは${format(dateTomorrow, 'yyyy/MM/dd HH:mm:ss')}まで有効です。</p><p>${process.env.DOMAIN_URL}/register/${registerToken}</p><p>※本メールに心当たりがない場合、お手数ですが破棄してください。</p>`;
        const mailResult: boolean = await sendEmail(email, subject, html);
        logger.info(`メールアドレス ${email} に認証メールを送信しました。`);

        if (!mailResult) {
            response.message = '認証メールの送信に失敗しました。';
            return response;
        }

        response.status = true;
        response.message = 'ユーザー仮登録が完了しました。認証メールをご確認ください。';
        return response;
    } catch (error) {
        logger.error('ユーザー仮登録処理中のエラー:', error);
        response.message = 'ユーザー仮登録に失敗しました。再度試みてください。';
        return response;
    }
});