import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
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
}

export const UserSchema = SchemaFactory.createForClass(User);
