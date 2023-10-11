import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("sessions")
export class Sessions {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100, nullable: false, comment: "ユーザーID" })
    user_id!: number;

    @Column({ type: "varchar", length: 100, nullable: false, comment: "セッションID" })
    session_id!: string;

    @Column({ type: "date", nullable: false, comment: "セッション有効期限" })
    session_expire_date!: Date;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", precision: null, comment: "作成日付" })
    create_date!: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP", precision: null, comment: "更新日付" })
    update_date!: Date;
};