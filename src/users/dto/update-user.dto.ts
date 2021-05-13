import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsPositive,
  Length,
  Min,
  Max,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';

enum Role {
  Student = 'Student',
  Parent = 'Parent',
  Teacher = 'Teacher',
  Admin = 'Admin',
}

export class UpdateUserDto {
  @ApiProperty({ required: true })
  @Length(1, 10, { message: '姓名長度需要小於十' })
  @IsString({ message: '姓名型態錯誤' })
  @IsOptional()
  userName: string;

  @ApiProperty({ required: true })
  @IsEmail({}, { message: 'Email 型態錯誤' })
  @IsOptional()
  email: string;

  @ApiProperty({ required: true })
  @Length(6, 20, { message: '密碼長度需介於 6 - 20 碼' })
  @IsString({ message: '密碼型態錯誤' })
  @IsOptional()
  password: string;

  @ApiProperty({ required: true })
  @IsEnum(Role, { message: '身分型態錯誤' })
  @IsNotEmpty({ message: '身分不得為空' })
  role: Role;

  @ApiProperty({ required: false })
  @Min(1, { message: '年齡最小為 1 歲' })
  @Max(200, { message: '年齡最大為 200 歲' })
  @IsPositive({ message: '年齡不得為負數' })
  @IsInt({ message: '年齡必須為整數' })
  @IsOptional()
  age: number;
}
