import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import Media from './media.entity'
import { FindOptionsWhere, Repository } from 'typeorm'

import { AccessData } from 'src/core/types/common'
import { getBearerToken } from 'src/core/helper/getToken'
import { PostType } from 'src/core/enums/post'
import { RelationWithUser } from 'src/core/enums/user'
import { MediaType, RelationType } from 'src/core/enums/media'
import generateResponse from 'src/core/helper/generateResponse'
import { UserService } from '../user/user.service'

@Injectable()
export class MediaService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly userService: UserService,
  ) {}

  async getImagesUsername(
    authorization: string,
    username: string,
    limit = 20,
    skip = 0,
  ) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const user = await this.userService.getByUsernameOptions(username, {
      select: {
        id: true,
      },
    })
    if (!user) throw new NotFoundException()

    let where: FindOptionsWhere<Media> | FindOptionsWhere<Media>[]

    if (user.id === id) {
      where = {
        user: {
          id,
        },
        type: MediaType.IMAGE,
      }
    } else {
      const relation = await this.userService.getRelation(id, user.id)
      if (relation === RelationWithUser.FRIEND) {
        where = [
          {
            relationType: RelationType.POST,
            user: {
              id: user.id,
            },
            post: {
              type: PostType.PUBLIC,
            },
            type: MediaType.IMAGE,
          },
          {
            relationType: RelationType.POST,
            user: {
              id: user.id,
            },
            post: {
              type: PostType.ONLY_FRIEND,
            },
            type: MediaType.IMAGE,
          },
        ]
      } else {
        where = {
          relationType: RelationType.POST,
          user: {
            id: user.id,
          },
          post: {
            type: PostType.PUBLIC,
          },
          type: MediaType.IMAGE,
        }
      }
    }

    const [medias, count] = await this.mediaRepository.findAndCount({
      where,
      take: limit,
      skip,
    })

    medias.forEach((media) => {
      media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
    })

    return generateResponse(
      {
        medias,
      },
      { count },
    )
  }

  async getVideosUsername(
    authorization: string,
    username: string,
    limit = 20,
    skip = 0,
  ) {
    const { id }: AccessData = await this.jwtService.verify(
      getBearerToken(authorization),
    )

    const user = await this.userService.getByUsernameOptions(username, {
      select: {
        id: true,
      },
    })

    if (!user) throw new NotFoundException()

    let where: FindOptionsWhere<Media> | FindOptionsWhere<Media>[]
    if (user.id === id) {
      where = {
        user: {
          id,
        },
        type: MediaType.VIDEO,
      }
    } else {
      const relation = await this.userService.getRelation(id, user.id)
      if (relation === RelationWithUser.FRIEND) {
        where = [
          {
            relationType: RelationType.POST,
            user: {
              id: user.id,
            },
            post: {
              type: PostType.PUBLIC,
            },
            type: MediaType.VIDEO,
          },
          {
            relationType: RelationType.POST,
            user: {
              id: user.id,
            },
            post: {
              type: PostType.ONLY_FRIEND,
            },
            type: MediaType.VIDEO,
          },
        ]
      } else {
        where = {
          relationType: RelationType.POST,
          user: {
            id: user.id,
          },
          post: {
            type: PostType.PUBLIC,
          },
          type: MediaType.VIDEO,
        }
      }
    }

    const [medias, count] = await this.mediaRepository.findAndCount({
      where,
      take: limit,
      skip,
    })

    medias.forEach((media) => {
      media.cdn = `${process.env.BE_BASE_URL}${media.cdn}`
    })

    return generateResponse(
      {
        medias,
      },
      {
        count,
      },
    )
  }
}
