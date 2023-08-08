import { ApiProperty } from '@nestjs/swagger'
import { Allow, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class SignupAuthDto {
  @ApiProperty({
    minLength: 6,
    maxLength: 100,
  })
  @IsEmail()
  @Length(6, 100)
  email: string

  @ApiProperty({
    minLength: 6,
    maxLength: 30,
  })
  @IsString()
  @Length(6, 30)
  password: string
}

export class LoginAuthDto {
  @ApiProperty({
    minLength: 6,
    maxLength: 100,
  })
  @IsEmail()
  @Length(6, 100)
  email: string

  @ApiProperty({
    minLength: 6,
    maxLength: 30,
  })
  @IsString()
  @Length(6, 30)
  password: string
}

export class SampleDto {
  @ApiProperty()
  @IsEmail()
  name: string
}

export class FileDto {
  @ApiProperty()
  @Allow()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @Allow()
  @IsEmail()
  email: string

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string
}
