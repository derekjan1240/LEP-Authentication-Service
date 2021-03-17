import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUsers(): Promise<User[]> {
    const Users = await this.userModel.find();
    return Users;
  }

  async createUser(user: CreateUserDto): Promise<String> {
    const User = await this.userModel.findOne({ email: user.email });
    if (User) {
      return `${user.email} 已經被註冊!`;
    } else {
      const newUser = await this.userModel.create({
        userName: user.userName,
        age: user.age,
        email: user.email,
        password: await bcrypt.hash(user.password, saltOrRounds),
      });
      newUser.save();
      return `${newUser.userName} 創建成功!`;
    }
  }

  async findOne(email: string): Promise<any> {
    const User = await this.userModel.findOne({ email });
    return User.toObject();
  }
}
