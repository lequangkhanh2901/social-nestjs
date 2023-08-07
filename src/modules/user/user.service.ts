import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { CreateUserDto, ResponseUser } from './user.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getByEmail(email: string) {
    return await this.userRepository.findOneBy({ email })
  }

  async addUser(createUser: CreateUserDto) {
    const user = this.userRepository.create({
      email: createUser.email,
      password: createUser.password,
    })
    const res = await this.userRepository.save(user)
    return res
  }

  async getById(id: string) {
    const user = await this.userRepository.findOneBy({ id })
    return user
  }

  async getMe(authorization: string): Promise<ResponseUser> {
    const token = authorization.replace('Bearer ', '')
    try {
      const data = await this.jwtService.verifyAsync(token)
      const user = await this.userRepository.findOneBy({ id: data.id })
      if (!user) throw new NotFoundException()
      return new ResponseUser(user)
    } catch (error) {
      if (error.status === 404) throw error
      throw new UnauthorizedException()
    }
  }
}
