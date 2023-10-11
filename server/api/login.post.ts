import { Users } from '../db/entities/Users';
import { Sessions } from '../db/entities/Sessions';
import { dataSource } from '../db/database';
import { addMonths } from 'date-fns';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import cookieSignature from 'cookie-signature';
import logger from '~/logger';
import { RequestBodyObject, ResponseObject } from '../../types/index';

export default defineEventHandler(async (event): Promise<ResponseObject> => {
    let response: ResponseObject = { status: false, message: '画面メッセージ' };

    try {
        const userRepository = dataSource.getRepository(Users);
        const { email, password }: RequestBodyObject = await readBody(event);
        const existingUser: Users | null = await userRepository.findOne({
            where: {
                email: email,
                main_regist_flg: true
            }
        });

        if (!existingUser) {
            logger.warn(`未知のメールアドレスでの認証試み。`);
            response.message = 'メールアドレスまたはパスワードが違います';
            return response;
        }

        logger.debug(`ユーザーID: ${existingUser.id} の認証を試みています。`);
        const isPasswordValid: boolean = bcryptjs.compareSync(password, existingUser.password);

        if (!isPasswordValid) {
            logger.warn(`ユーザーID: ${existingUser.id} のパスワード検証に失敗しました。`);
            response.message = 'メールアドレスまたはパスワードが違います';
            return response;
        }

        const sessionRepository = dataSource.getRepository(Sessions);
        const sessionId: Sessions['session_id'] = crypto.randomUUID();
        const oneMonthLater: Date = addMonths(new Date(), 1);

        logger.debug(`ユーザーID: ${existingUser.id} の新しいセッションを作成しています。`);
        const newSession: Sessions = sessionRepository.create({
            user_id: existingUser.id,
            session_id: sessionId,
            session_expire_date: oneMonthLater
        });

        await sessionRepository.save(newSession);

        const signedSessionId: string = cookieSignature.sign(sessionId, process.env.SESSION_SECRET || 'secret');
        setCookie(event, process.env.SESSION_NAME || '__session', signedSessionId, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            expires: oneMonthLater
        });

        logger.info(`ユーザーID: ${existingUser.id} が正常に認証されました。`);
        response.status = true;
        response.message = 'ログイン成功';
        return response;
    } catch (error) {
        logger.error('認証中にエラーが発生しました:', error);
        response.message = 'ログインに失敗しました。再度試みてください。';
        return response;
    }
});