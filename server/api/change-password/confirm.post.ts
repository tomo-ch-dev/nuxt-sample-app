import { Users } from '../../db/entities/Users';
import { dataSource } from '../../db/database';
import bcryptjs from 'bcryptjs';
import logger from '~/logger';
import { ResponseObject, RequestBodyObject } from '../../../types/index';

export default defineEventHandler(async (event): Promise<ResponseObject> => {
    let response: ResponseObject = { status: false, message: '画面メッセージ' };

    try {
        const userRepository = dataSource.getRepository(Users);
        const { email, password }: RequestBodyObject = await readBody(event);

        const existUser = await userRepository.findOne({
            where: {
                email: email,
                main_regist_flg: true
            }
        });

        if (!existUser) {
            logger.warn(`未知のメールアドレスでのパスワード変更試み。`);
            response.message = '該当するメールアドレスが見つかりません';
            return response;
        }

        logger.debug(`ユーザーID: ${existUser.id} のパスワードを変更しています。`);

        const hashedPassword: string = bcryptjs.hashSync(password, 10);
        existUser.password = hashedPassword;
        await userRepository.save(existUser);
        logger.info(`ユーザーID: ${existUser.id} のパスワードが正常に変更されました。`);

        response.status = true;
        response.message = 'パスワードが正常に変更されました'
        return response;
    } catch (error) {
        logger.error('パスワード変更中にエラーが発生しました:', error);
        response.message = 'パスワード変更が失敗しました';
        return response;
    }
});