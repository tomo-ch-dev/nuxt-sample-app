import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class Users {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100, nullable: false, comment: "メールアドレス" })
    email!: string;

    @Column({ type: "varchar", length: 100, nullable: false, comment: "パスワード" })
    password!: string;

    @Column({ type: "tinyint", nullable: false, comment: "本登録フラグ" })
    main_regist_flg!: boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", precision: null, comment: "作成日付" })
    create_date!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", precision: null, comment: "更新日付" })
    update_date!: Date;
};