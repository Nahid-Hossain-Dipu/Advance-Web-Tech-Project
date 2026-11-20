import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

export enum VerificationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

@Entity({ name: "verifications" })
export class Verification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  user_id!: string;

  // many verification requests belong to one user
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  // where the uploaded photo is saved
  @Column()
  document_path!: string;

  @Column({ type: "varchar", default: VerificationStatus.PENDING })
  status!: VerificationStatus;

  @Column({ type: "varchar", nullable: true })
  admin_note?: string | null;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  reviewed_at?: Date | null;
}