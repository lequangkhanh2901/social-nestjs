import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { dataSourceOptions } from './database/data-source'
import { MailModule } from './modules/mail/mail.module'
import { MediaModule } from './modules/media/media.module'
import { PostModule } from './modules/post/post.module'
import { CommentModule } from './modules/comment/comment.module'
import { LikeModule } from './modules/like/like.module'
import { FriendModule } from './modules/friend/friend.module'
import { RequestFriendModule } from './modules/request-friend/request-friend.module'
import { ConversationModule } from './modules/conversation/conversation.module'
import { MessageModule } from './modules/message/message.module'
import { EventsModule } from './modules/events/events.module'
import { NotificationModule } from './modules/notification/notification.module'
import { ReportModule } from './modules/report/report.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      global: true,
      signOptions: {},
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    MailModule,
    MediaModule,
    // AlbumModule,
    PostModule,
    CommentModule,
    LikeModule,
    FriendModule,
    RequestFriendModule,
    ConversationModule,
    MessageModule,
    EventsModule,
    NotificationModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
