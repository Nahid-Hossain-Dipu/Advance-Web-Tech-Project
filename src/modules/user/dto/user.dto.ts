import { IsNotEmpty , IsOptional } from "class-validator";
import { Role } from "@/common/enums/role.enum";

export class CreateUserDto{
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    email!: string; 

    @IsNotEmpty()
    password!: string;

    // role is optional, the database gives ROLE_PASSENGER by default
    @IsOptional()
    role?: Role;

    @IsOptional()
    created_at?: Date = new Date();
    
    @IsOptional()
    updated_at?: Date = new Date();
}

export class UpdateUserDto{
    @IsNotEmpty()
    name!: string;


    @IsNotEmpty()
    email!: string; 

    @IsNotEmpty()
    password!: string;

    @IsOptional()
    created_at?: Date = new Date();
    
    @IsOptional()
    updated_at?: Date = new Date();
}