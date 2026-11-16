import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

export enum ReportStatus {
    PENDING = "pending",
    REVIEWED = "reviewed",
    RESOLVED = "resolved",
}

@Entity({ name: "reports" })
export class Report {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    reporter_id!: string;

    @Column({ type: "uuid" })
    reported_user_id!: string;

    @Column({ type: "uuid", nullable: true })
    trip_id?: string;

    @Column({ type: "varchar", length: 255 })
    reason!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({
        type: "enum",
        enum: ReportStatus,
        default: ReportStatus.PENDING,
    })
    status!: ReportStatus;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date;
}