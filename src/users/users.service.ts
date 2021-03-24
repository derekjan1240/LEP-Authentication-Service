import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findUsers(): Promise<User[]> {
    const Users = await this.userModel.find();
    return Users;
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const User = await this.userModel.findOne({ email: user.email });
    if (User) {
      throw new HttpException(`${user.email} 已經被註冊!`, HttpStatus.CONFLICT);
    } else {
      const newUser = await this.userModel.create({
        userName: user.userName,
        age: user?.age || null,
        email: user.email,
        password: await bcrypt.hash(user.password, saltOrRounds),
      });
      newUser.save();

      return newUser;
    }
  }

  async findOne(email: string): Promise<any> {
    const User = await this.userModel.findOne({ email });
    return User.toObject();
  }
}
