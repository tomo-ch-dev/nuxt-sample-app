import { Users } from '../../db/entities/Users';
import { UserVerifications } from '../../db/entities/UserVerifications';
import { dataSource } from '../../db/database';
import { MoreThan } from 'typeorm';
import logger from '~/logger';
import { RequestToken, ResponseObject } from '../../../types/index';

export default defineEventHandler(async (event): Promise<ResponseObject> => {
    let response : ResponseObject = { status: false, message: '画面メッセージ' };

    try {
        const userVerificationRepository = dataSource.getRepository(UserVerifications);
        const { token }: RequestToken = await readBody(event);
        const nowDate: Date = new Date();

        const tempVerifyUser: UserVerifications | null = await userVerificationRepository.findOne({
            where: {
                register_token: token,
                token_valid_flg: true,
                token_expire_date: MoreThan(nowDate)
            }
        });

        if (!tempVerifyUser) {
            logger.warn('該当するユーザー認証情報が見つかりませんでした。');
            response.message = 'ユーザが仮登録されていません。';
            return response;
        }

        tempVerifyUser.token_valid_flg = false;
        await userVerificationRepository.save(tempVerifyUser);
        logger.info('ユーザー認証情報を更新しました。');

        const userRepository = dataSource.getRepository(Users);
        const tempUser: Users | null = await userRepository.findOne({ where: { id: tempVerifyUser.user_id } });

        if (!tempUser) {
            logger.warn(`ID: ${tempVerifyUser.user_id} のユーザーが見つかりませんでした。`);
            response.message = 'ユーザが仮登録されていません。';
            return response;
        }

        tempUser.main_regist_flg = true;
        await userRepository.save(tempUser);
        logger.info(`ユーザーID: ${tempVerifyUser.user_id} の本登録フラグを更新しました。`);

        response.status = true;
        response.message = 'ユーザー登録完了';
        return response;
    } catch (error) {
        logger.error('ユーザー本登録処理中のエラー:', error);
        response.message = 'ユーザー本登録に失敗しました。再度試みてください。';
        return response;
    }
});