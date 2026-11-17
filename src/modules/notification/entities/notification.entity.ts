import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("notifications")
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    user_id!: string;

    @Column({ type: "varchar", length: 150 })
    title!: string;

    @Column({ type: "text" })
    message!: string;

    @Column({ type: "boolean", default: false })
    is_read!: boolean;

    @CreateDateColumn()
    created_at!: Date;
}