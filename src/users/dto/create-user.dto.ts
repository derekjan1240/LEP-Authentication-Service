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
  IsFQDN,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @Length(1, 10, { message: '姓名長度需要小於十' })
  @IsString({ message: '姓名型態錯誤' })
  @IsNotEmpty({ message: '姓名不得為空' })
  userName: string;

  @ApiProperty({ required: true })
  @Min(1, { message: '年齡最小為 1 歲' })
  @Max(200, { message: '年齡最大為 200 歲' })
  @IsPositive({ message: '年齡不得為負數' })
  @IsInt({ message: '年齡必須為整數' })
  @IsNotEmpty({ message: '年齡不得為空' })
  age: number;

  @ApiProperty({ required: true })
  @IsEmail({}, { message: 'Email 型態錯誤' })
  @IsFQDN({}, { message: 'Email 型態錯誤' })
  @IsNotEmpty({ message: 'Email 不得為空' })
  email: string;

  @ApiProperty({ required: true })
  @Length(6, 20, { message: '密碼長度需介於 6 - 20 碼' })
  @IsString({ message: '密碼型態錯誤' })
  @IsNotEmpty({ message: '密碼不得為空' })
  password: string;
}