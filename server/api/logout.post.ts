import { Sessions } from '../db/entities/Sessions';
import { dataSource } from '../db/database';
import logger from '~/logger';
import { ResponseObject } from '~/types';

export default defineEventHandler(async (event): Promise<ResponseObject> => {
    let response: ResponseObject = { status: false, message: '画面メッセージ' };

    const userId: number = event.context.userId;
    const sessionId: string = event.context.sessionId;
 
    try {
        const sessionRepository = dataSource.getRepository(Sessions);
        const existSession = await sessionRepository.findOne({
            where: {
                user_id: userId,
                session_id: sessionId
            }
        });

        if (!existSession) {
            logger.warn('データベースに該当するsession_idが見つかりませんでした。');
            response.message = '存在しないセッションからのログアウト要求';
            return response;
        }

        await sessionRepository.remove(existSession);
        logger.info('データベースからsession_idを正常に削除しました。');

        response.status = true;
        response.message = 'ログアウトしました';
        return response;
    } catch (error) {
        logger.error('ログアウト処理中にエラーが発生しました:', error);
        response.message = 'ログアウト処理が失敗しました';
        return response;
    }
});