import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async findByIds(ids): Promise<User[]> {
    const Users = await this.userModel
      .find({
        _id: {
          $in: ids,
        },
      })
      .select('_id userName email');
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
        role: user.role,
        password: await bcrypt.hash(user.password, saltOrRounds),
      });
      newUser.save();

      return newUser;
    }
  }

  async updateUser(userId: String, data: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException('更新失敗', HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByEmail(email: string): Promise<any> {
    const User = await this.userModel.findOne({ email });
    return User.toObject();
  }

  async findOneById(userId: string): Promise<any> {
    try {
      const User = await this.userModel.findById(userId);
      return User;
    } catch (error) {
      throw new HttpException('使用者不存在', HttpStatus.NOT_FOUND);
    }
  }
}
