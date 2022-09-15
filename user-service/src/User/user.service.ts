import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from "mongoose";
import { UserDocument } from "./user.schema";

@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly UserModel: Model<UserDocument>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = await new this.UserModel(createUserDto);
    return newUser.save();
  }

  async updateUser(UserId: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const existingUser = await this.UserModel.findByIdAndUpdate(UserId, updateUserDto, { new: true });
    if (!existingUser) {
      throw new NotFoundException(`User #${UserId} not found`);
    }
    return existingUser;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    const UserData = await this.UserModel.find();
    if (!UserData || UserData.length == 0) {
      throw new NotFoundException('User data not found!');
    }
    return UserData;
  }

  async getUser(UserId: string): Promise<UserDocument> {
    const existingUser = await this.UserModel.findById(UserId).exec();
    if (!existingUser) {
      throw new NotFoundException(`User #${UserId} not found`);
    }
    return existingUser;
  }

  async deleteUser(UserId: string): Promise<UserDocument> {
    const deletedUser = await this.UserModel.findByIdAndDelete(UserId);
    if (!deletedUser) {
      throw new NotFoundException(`User #${UserId} not found`);
    }
    return deletedUser;
  }
}