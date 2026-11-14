import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/modules/user/entities/user.entity";

@Entity({ name: "vehicles" })
export class Vehicle {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    driver_id!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "driver_id" })
    driver?: User;

    @Column()
    type!: string;

    @Column()
    model!: string;

    @Column({ unique: true })
    plate_no!: string;

    @Column()
    seat_capacity!: number;

    @Column()
    created_at?: Date;

    @Column()
    updated_at?: Date;
}