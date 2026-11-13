import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "@/common/enums/role.enum";

@Entity({name:"users"})
export class User{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    // role of the user: admin, driver or passenger
    @Column({ type: "varchar", default: Role.PASSENGER })
    role!: Role;

    // true after an admin approves the ID or licence photo
    @Column({ type: "boolean", default: false })
    is_verified!: boolean;

    @Column()
    created_at?: Date;

    @Column()
    updated_at?: Date;

}