import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'
import { User } from 'src/modules/user/user.entity'
import Media from 'src/modules/media/media.entity'
import Album from 'src/modules/album/album.entity'
import Post from 'src/modules/post/post.entity'
import Comment from 'src/modules/comment/comment.entity'
import Like from 'src/modules/like/like.entity'
import Friend from 'src/modules/friend/friend.entity'
import RequestFriend from 'src/modules/request-friend/request-friend.entity'
import Conversation from 'src/modules/conversation/conversation.entity'
import Message from 'src/modules/message/message.entity'

config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    RequestFriend,
    Media,
    Album,
    Post,
    Comment,
    Like,
    Friend,
    Conversation,
    Message,
  ],
  migrations: ['dist/database/migrations/*.js'],
  // logging: true,
}

const AppDataSource = new DataSource(dataSourceOptions)

export default AppDataSource
