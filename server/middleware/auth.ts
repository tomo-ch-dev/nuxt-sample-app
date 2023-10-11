import { Sessions } from '../db/entities/Sessions';
import { dataSource } from '../db/database';
import cookieSignature from 'cookie-signature';
import { addMonths } from 'date-fns';
import logger from '~/logger';

export default defineEventHandler(async (event) => {
    logger.debug('サーバーミドルウェアがトリガーされました。');
    const reqUrl: string = event.node.req.url || '';
    logger.debug(`リクエストURL: ${reqUrl}`);

    // ログイン後画面のみ認証チェックを行う
    const checkUrls = [
        /\/home/,
        /\/logout/,
    ];

    const isCheckUrl: boolean = checkUrls.some(url => typeof url === 'string' ? reqUrl === url : url.test(reqUrl));
    if (!isCheckUrl) return;

    logger.debug(`認証開始`);
    const cookie = parseCookies(event)['__session'];
    logger.debug(`クッキー: ${cookie}`);
    if (!cookie) return createError({ statusCode: 401 ,statusMessage: 'Unauthenticated'});

    const unsignedSession = cookieSignature.unsign(cookie, process.env.SESSION_SECRET || 'secret');
    if (!unsignedSession) return createError({ statusCode: 401 ,statusMessage: 'Unauthenticated'});

    try {
        const sessionRepository = dataSource.getRepository(Sessions);
        const existSession: Sessions | null = await sessionRepository.findOne({ where: { session_id: unsignedSession } });

        if (!existSession) {
            logger.warn('データベースに該当するsession_idが見つかりませんでした。');
            return createError({ statusCode: 401 ,statusMessage: 'Unauthenticated'});
        }

        const nowDate = new Date();
        if (existSession.session_expire_date < nowDate) {
            logger.warn('session_idの有効期限が切れています。');
            return createError({ statusCode: 401 ,statusMessage: 'Unauthenticated'});
        }

        // 後続のAPIでユーザーID,SessionIDを使用するため、コンテキストにセット
        event.context.userId = existSession.user_id;
        event.context.sessionId = unsignedSession; 
        logger.info('認証に成功しました。');
        // 有効期限を現在日付の1ヶ月後に更新
        const newExpireDate: Date = addMonths(nowDate, 1);
        existSession.session_expire_date = newExpireDate;
        await sessionRepository.save(existSession);
        logger.info('session_idの有効期限を更新しました。');

        // クッキーの有効期限も更新
        const signedSessionId = cookieSignature.sign(unsignedSession, process.env.SESSION_SECRET || 'secret');
        setCookie(event, process.env.SESSION_NAME || '__session', signedSessionId, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            expires: newExpireDate
        });

        await useStorage().setItem(cookie, existSession.user_id);
    } catch (error) {
        logger.error('認証処理中にエラーが発生しました:', error);
        return createError({ statusCode: 401 ,statusMessage: 'Unauthenticated'});
    }
});
