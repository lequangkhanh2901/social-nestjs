import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import { Allow, IsOptional, IsString, IsUUID } from 'class-validator'
import { PostType } from 'src/core/enums/post'
import { UserRoles, UserSex } from 'src/core/enums/user'
import Like from '../like/like.entity'

export class CreatePostDto {
  @Allow()
  @ApiProperty({
    required: false,
  })
  content?: string

  @Allow()
  @ApiProperty({
    enum: PostType,
  })
  type: PostType

  @ApiProperty({
    required: false,
  })
  @Allow()
  @IsOptional()
  userIds: string[]

  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  medias?: any[]
}

export class ResponseUserPost {
  name: string
  username: string

  @Exclude()
  email: string

  @Exclude()
  avatar: string

  @Exclude()
  password: string

  @Exclude()
  id: string

  @Exclude()
  status: string

  @Exclude()
  actived: boolean

  @Exclude()
  updatedAt: Date

  @Exclude()
  sex: UserSex

  @Exclude()
  role: UserRoles

  constructor(partial: Partial<ResponseUserPost>) {
    Object.assign(this, partial)
  }
}

export class ResponsePost {
  @Exclude()
  likes: Like[]

  @Expose()
  likeData() {
    return {
      total: this.likes.length,
    }
  }

  constructor(partial: Partial<ResponsePost>) {
    Object.assign(this, partial)
  }
}

export class DeletePostDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
  })
  @IsUUID()
  id: string
}

export class UpdatePostDto {
  @ApiProperty()
  @IsUUID()
  id: string

  @ApiProperty({
    required: false,
  })
  @Allow()
  @IsString()
  @IsOptional()
  content?: string

  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  medias?: any[]

  @ApiProperty({
    required: false,
    type: 'array',
    format: 'uuid',
  })
  @Allow()
  @IsUUID('all', { each: true })
  @IsOptional()
  keepMedia?: string[]

  @Allow()
  @ApiProperty({
    enum: PostType,
  })
  type: PostType
}
