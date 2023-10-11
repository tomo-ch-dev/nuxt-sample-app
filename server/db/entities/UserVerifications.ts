import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("user_verifications")
export class UserVerifications {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100, nullable: false, comment: "ユーザーID" })
    user_id!: number;

    @Column({ type: "varchar", length: 100, nullable: false, comment: "仮登録トークン" })
    register_token!: string;

    @Column({ type: "tinyint", nullable: false, comment: "トークン有効フラグ" })
    token_valid_flg!: boolean;

    @Column({ type: "datetime", nullable: true, comment: "トークン有効期限" })
    token_expire_date!: Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", precision: null, comment: "作成日付" })
    create_date!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", precision: null, comment: "更新日付" })
    update_date!: Date;
};