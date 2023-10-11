const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1697000004167 {
    name = 'Migration1697000004167'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL COMMENT 'メールアドレス', \`password\` varchar(100) NOT NULL COMMENT 'パスワード', \`main_regist_flg\` tinyint NOT NULL COMMENT '本登録フラグ', \`create_date\` timestamp NOT NULL COMMENT '作成日付' DEFAULT CURRENT_TIMESTAMP, \`update_date\` timestamp NOT NULL COMMENT '更新日付' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_verifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(100) NOT NULL COMMENT 'ユーザーID', \`register_token\` varchar(100) NOT NULL COMMENT '仮登録トークン', \`token_valid_flg\` tinyint NOT NULL COMMENT 'トークン有効フラグ', \`token_expire_date\` datetime NULL COMMENT 'トークン有効期限', \`create_date\` timestamp NOT NULL COMMENT '作成日付' DEFAULT CURRENT_TIMESTAMP, \`update_date\` timestamp NOT NULL COMMENT '更新日付' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sessions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(100) NOT NULL COMMENT 'ユーザーID', \`session_id\` varchar(100) NOT NULL COMMENT 'セッションID', \`session_expire_date\` date NOT NULL COMMENT 'セッション有効期限', \`create_date\` timestamp NOT NULL COMMENT '作成日付' DEFAULT CURRENT_TIMESTAMP, \`update_date\` timestamp NOT NULL COMMENT '更新日付' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`sessions\``);
        await queryRunner.query(`DROP TABLE \`user_verifications\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
