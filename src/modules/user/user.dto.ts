import { Exclude } from 'class-transformer'
import { UserRoles, UserStatus } from 'src/core/enums/user'

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
  @Exclude()
  id: string

  name: string
  username: string
  email: string

  @Exclude()
  password: string

  actived: boolean
  status: UserStatus
  role: UserRoles
  avatar: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<ResponseUser>) {
    Object.assign(this, partial)
  }
}
