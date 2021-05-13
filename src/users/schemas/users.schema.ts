import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ['Student', 'Parent', 'Teacher', 'Admin'],
    default: 'Student',
  })
  role: string;

  // For comparing passwords
  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  toJson() {
    return {
      userName: this.userName,
      age: this.age,
      email: this.email,
      role: this.role,
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);
