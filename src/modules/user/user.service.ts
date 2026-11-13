import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { hashPassword } from "@/common/helpers/password.helper";

@Injectable()
export class UserService {
constructor
(@InjectRepository(User)
private readonly userRepository: Repository<User>,
){}

async getUsers(){

    try{
        const users = await this.userRepository.find();
        // do not send passwords to the client
        return users.map(({ password, ...rest }) => rest);
    }
    catch (error){
        throw error;
    }
}

async createUser(dto: CreateUserDto){
    try{
        // one email can be used only once
        const oldUser = await this.findOneByEmail(dto.email);
        if(oldUser){
            throw new ConflictException("Email already registered");
        }
        // save the hash, never the plain password
        dto.password = await hashPassword(dto.password);
        const responce = await this.userRepository.create(dto);
        const saved = await this.userRepository.save(responce);
        const { password, ...rest } = saved;
        return rest;
    }
    catch(error){
        throw error;
    }
}

async updateUser (id: string, dto: UpdateUserDto){
    try{
        console.log("id",id);
        if(!id)
        {
            throw new NotFoundException("User not found");
        }
        const user= await this.userRepository.findOne(
            {
                where: {
                    id:id,
                },
            }        );
            if(!user){
                throw new NotFoundException("User not found");
            }
            if(dto.password){
                dto.password = await hashPassword(dto.password);
            }
            Object.assign(user,dto);
            const{id: uid, ...rest } =user;
            return await this.userRepository.update({id:id}, rest);
    } catch (error){
        throw error;
    }
}

async deleteUser(id: string){
    try{
        const user = await this.userRepository.findOne({
            where: {
                id:id,
    },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return await this.userRepository.delete({ id:id });
    } catch (error) {
        throw error;
    }
}

async findOneByEmail(email: string): Promise<User | null> {
    try{
        const user = await this.userRepository.findOne({
            where: {
                email: email,}});
        return user;
    }catch (error){
        throw error;
    }
}


// Is this user verified by an admin?
async isVerified(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
        where: {
            id: id,
        },
    });
    if (!user) {
        throw new NotFoundException("User not found");
    }
    return user.is_verified;
}

// Admin approves or rejects: change the verified flag
async setVerified(id: string, value: boolean) {
    const user = await this.userRepository.findOne({
        where: {
            id: id,
        },
    });
    if (!user) {
        throw new NotFoundException("User not found");
    }
    user.is_verified = value;
    await this.userRepository.save(user);
}

// Other modules call this before an action that needs a verified user
async assertVerified(id: string) {
    const verified = await this.isVerified(id);
    if (!verified) {
        throw new ForbiddenException("Your account is not verified yet");
    }
}
}