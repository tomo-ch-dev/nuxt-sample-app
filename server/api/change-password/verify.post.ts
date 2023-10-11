import { Users } from '../../db/entities/Users';
import { UserVerifications } from '../../db/entities/UserVerifications';
import { dataSource } from '../../db/database';
import { MoreThan } from 'typeorm';
import logger from '~/logger';
import { ResponseWithEmail, RequestToken } from '../../../types/index';

export default defineEventHandler(async (event): Promise<ResponseWithEmail> => {
    let response: ResponseWithEmail = { status: false, message: '画面メッセージ', email: '' };

    try {
        const userVerificationRepository = dataSource.getRepository(UserVerifications);
        const { token }: RequestToken = await readBody(event);
        const nowDate: Date = new Date();

        const existVerifyUser = await userVerificationRepository.findOne({
            where: {
                register_token: token,
                token_valid_flg: true,
                token_expire_date: MoreThan(nowDate)
            }
        });

        if (!existVerifyUser) {
            logger.warn('該当するユーザー認証情報が見つかりませんでした。');
            response.message = 'パスワード変更用の認証情報が見つかりません。';
            return response;
        }

        existVerifyUser.token_valid_flg = false;
        await userVerificationRepository.save(existVerifyUser);
        logger.info('ユーザー認証情報を更新しました。');

        const userRepository = dataSource.getRepository(Users);
        const existUser = await userRepository.findOne({
            where: {
                id: existVerifyUser.user_id,
                main_regist_flg: true
            }
        });

        if (!existUser) {
            logger.warn(`ID: ${existVerifyUser.user_id} のユーザーが見つかりませんでした。`);
            response.message = '存在しないユーザです。';
            return response;
        }

        logger.info(`アドレス: ${existUser.email} のユーザーが見つかりました。`);
        response.status = true;
        response.message = 'パスワード変更ユーザの認証完了'
        response.email = existUser.email;
        return response;
    } catch (error) {
        logger.error('パスワード変更ユーザの認証時のエラー:', error);
        response.message = 'パスワード変更ユーザの認証に失敗しました。';
        return response;
    }
});