import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getBearerToken } from 'src/core/helper/getToken'
import { FriendService } from '../friend/friend.service'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import { InjectRepository } from '@nestjs/typeorm'
import RequestFriend from './request-friend.entity'
import { Repository } from 'typeorm'

@Injectable()
export class RequestFriendService {
  constructor(
    @InjectRepository(RequestFriend)
    private readonly requestFriendRepository: Repository<RequestFriend>,
    private readonly jwtService: JwtService,
    private readonly friendService: FriendService,
  ) {}

  async request(token: string, uid: string) {
    const data = await this.jwtService.verify(getBearerToken(token))
    const friend = await this.friendService.getFriend(data.id, uid)

    if (friend)
      throw new HttpException(
        ResponseMessage.ALREADY_FRIEND,
        HttpStatus.BAD_REQUEST,
      )

    // const request = await this.requestFriendRepository.findOneBy({

    // })

    return 'hihi'
  }
}
