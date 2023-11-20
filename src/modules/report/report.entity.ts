// import {
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm'
// import { User } from '../user/user.entity'
// import Post from '../post/post.entity'
// import Comment from '../comment/comment.entity'

// @Entity()
// export class Report {
//   @PrimaryGeneratedColumn('uuid')
//   id: string

//   @ManyToOne(() => User, (user) => user.reports)
//   user: User

//   @OneToOne(() => User)
//   @JoinColumn()
//   userTarget: User

//   @OneToOne(() => Post, {
//     nullable: true,
//   })
//   @JoinColumn()
//   post?: Post

//   @OneToOne(() => Comment, {
//     nullable: true,
//   })
//   @JoinColumn()
//   comment?: Comment

//   @CreateDateColumn()
//   createdAt: string

//   @UpdateDateColumn()
//   updatedAt: string
// }
