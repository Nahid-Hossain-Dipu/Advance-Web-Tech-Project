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

    @Column()
    created_at?: Date;

    @Column()
    updated_at?: Date;

}