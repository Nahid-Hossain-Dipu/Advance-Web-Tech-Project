import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "areas" })
export class Area {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    name!: string;

    @Column({ default: true })
    is_active!: boolean;

    @Column()
    created_at?: Date;

    @Column()
    updated_at?: Date;
}