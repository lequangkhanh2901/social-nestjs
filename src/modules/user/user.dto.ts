import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
import { IsEnum, IsString, Length } from 'class-validator'
import { NotMatch } from 'src/core/decorators/validation/not-match.decorator'
import { UserRoles, UserSex, UserStatus } from 'src/core/enums/user'
import Media from '../media/media.entity'

export class CreateUserDto {
  email: string
  password: string
  // @ApiProperty({
  //   maxLength: 50,
  //   minLength: 3,
  // })
  // @IsString()
  // @Length(3, 50)
  // name: string

  // @ApiProperty({
  //   maxLength: 100,
  //   minLength: 6,
  // })
  // @IsEmail()
  // @Length(6, 100)
  // email: string

  // @ApiProperty({
  //   maxLength: 30,
  //   minLength: 6,
  // })
  // @IsString()
  // @Length(6, 30)
  // password: string

  // @ApiProperty({
  //   maxLength: 50,
  //   minLength: 4,
  // })
  // @IsString()
  // @Length(4, 50)
  // username: string
}

export class ResponseUser {
  // @Exclude()
  id: string

  name: string
  username: string
  email: string
  sex: UserSex

  @Exclude()
  password: string

  actived: boolean
  status: UserStatus
  role: UserRoles
  avatar: string
  avatarId: Media
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<ResponseUser>) {
    Object.assign(this, partial)
  }
}

export class UpdatePasswordDto {
  @ApiProperty({
    minLength: 6,
    maxLength: 30,
  })
  @Length(6, 30)
  @Transform(({ value }) => value?.trim())
  @IsString()
  oldPass: string

  @ApiProperty({
    minLength: 6,
    maxLength: 30,
  })
  @Length(6, 30)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @NotMatch('oldPass')
  newPass: string
}

export class UpdateUserDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @Length(2, 30)
  name: string

  @ApiProperty({
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @Length(6, 30)
  username: string

  @ApiProperty({
    enum: UserSex,
  })
  @IsEnum(UserSex)
  sex: UserSex
}

export class UploadAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: any
}
