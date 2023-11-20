import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeFriend1700368784083 implements MigrationInterface {
  name = 'ChangeFriend1700368784083'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`request_friend\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`userTargetId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`albums\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`type\` enum ('DEFAULT', 'CUSTOM') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`postId\` varchar(36) NULL, \`commentId\` int NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`mpath\` varchar(255) NULL DEFAULT '', \`userId\` varchar(36) NOT NULL, \`postId\` varchar(36) NOT NULL, \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`posts\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`type\` enum ('PRIVATE', 'PUBLIC', 'ONLY_FRIEND', 'CUSTOM_EXCLUDE', 'CUSTOM_ONLY') NOT NULL, \`userIds\` json NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`conversation\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(30) NULL, \`type\` enum ('GROUP', 'DUAL') NOT NULL, \`status\` enum ('PUBLIC', 'PRIVATE') NOT NULL, \`unreadLastUsersId\` json NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`chiefId\` varchar(36) NULL, \`avatarId\` varchar(36) NULL, UNIQUE INDEX \`REL_ef90ee422970e634bed97a9cde\` (\`chiefId\`), UNIQUE INDEX \`REL_3cdae851f0b12baae5d6c715f6\` (\`avatarId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`message\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`status\` enum ('NORMAL', 'EDITED', 'CANCEL') NOT NULL DEFAULT 'NORMAL', \`viewStatus\` enum ('SENT', 'RECEIVED', 'VIEWED') NOT NULL DEFAULT 'SENT', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`conversationId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`medias\` (\`id\` varchar(36) NOT NULL, \`cdn\` varchar(255) NOT NULL, \`type\` enum ('IMAGE', 'VIDEO', 'PDF') NOT NULL, \`relationType\` enum ('POST', 'COMMENT', 'MESSAGE') NOT NULL DEFAULT 'POST', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`postId\` varchar(36) NULL, \`commentId\` int NULL, \`messageId\` varchar(36) NULL, UNIQUE INDEX \`REL_6ef8f3de55338d9d0b8ebd4f14\` (\`commentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`notification\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('LIKE_MY_POST', 'LIKE_MY_COMMENT', 'NEW_POST_FROM_FRIEND', 'USER_COMMENTED_MY_POST', 'NEW_REQUEST_FRIEND', 'USER_ACCEPTED_REQUEST_FRIEND') NOT NULL, \`userIds\` json NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime NOT NULL, \`userId\` varchar(36) NULL, \`userTagetId\` varchar(36) NULL, \`postId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`friends\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userOneId\` varchar(36) NULL, \`userTwoId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL DEFAULT '', \`username\` varchar(50) NULL, \`email\` varchar(100) NOT NULL, \`password\` text NOT NULL, \`actived\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('ACTIVE', 'BANNED', 'LOCKED') NOT NULL DEFAULT 'ACTIVE', \`role\` enum ('ADMIN', 'MANAGER', 'NORMAL') NOT NULL DEFAULT 'NORMAL', \`avatar\` varchar(255) NOT NULL DEFAULT '', \`sex\` enum ('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'OTHER', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`avatarIdId\` varchar(36) NULL, INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`REL_f9053cc87d5bb754cbc6f61953\` (\`avatarIdId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`albums_medias_medias\` (\`albumsId\` varchar(36) NOT NULL, \`mediasId\` varchar(36) NOT NULL, INDEX \`IDX_cefaf0fa6136996c4f4d641a89\` (\`albumsId\`), INDEX \`IDX_95805b23b60c9acd33ccb921fe\` (\`mediasId\`), PRIMARY KEY (\`albumsId\`, \`mediasId\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`conversation_users_users\` (\`conversationId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_360ad3e31b30b769923aee131d\` (\`conversationId\`), INDEX \`IDX_5bddbb73e052d228d013892322\` (\`usersId\`), PRIMARY KEY (\`conversationId\`, \`usersId\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`conversation_deputies_users\` (\`conversationId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_1121e5401eb7388de66918b14d\` (\`conversationId\`), INDEX \`IDX_28ba2d7f7e38085542e0e49b28\` (\`usersId\`), PRIMARY KEY (\`conversationId\`, \`usersId\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` ADD CONSTRAINT \`FK_2101227cceb4b41d216fbc0a9eb\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` ADD CONSTRAINT \`FK_e2fae7ed063eca039b85d3dc950\` FOREIGN KEY (\`userTargetId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums\` ADD CONSTRAINT \`FK_8e46da7abb99e39551c42451684\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_e2fe567ad8d305fefc918d44f50\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_ec3c75d6522fc60e0ebaf58a6b7\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_cfd8e81fac09d7339a32e57d904\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_ef90ee422970e634bed97a9cde6\` FOREIGN KEY (\`chiefId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_3cdae851f0b12baae5d6c715f6f\` FOREIGN KEY (\`avatarId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_446251f8ceb2132af01b68eb593\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7cf4a4df1f2627f72bf6231635f\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_0ca422a52c318ce86181dbf01ed\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_ca0a94a1fc09f86dada24760f0f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_6ef8f3de55338d9d0b8ebd4f144\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_43b1012f7fee059597596e8a131\` FOREIGN KEY (\`messageId\`) REFERENCES \`message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_232618d03056f5eccc093d39d42\` FOREIGN KEY (\`userTagetId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_c7dc378ca2844fdfe647e00e993\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e13972ffe2f26327f658f3811c3\` FOREIGN KEY (\`userOneId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e89cebf7d37c4face022c527935\` FOREIGN KEY (\`userTwoId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_f9053cc87d5bb754cbc6f619537\` FOREIGN KEY (\`avatarIdId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums_medias_medias\` ADD CONSTRAINT \`FK_cefaf0fa6136996c4f4d641a898\` FOREIGN KEY (\`albumsId\`) REFERENCES \`albums\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums_medias_medias\` ADD CONSTRAINT \`FK_95805b23b60c9acd33ccb921fe0\` FOREIGN KEY (\`mediasId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation_users_users\` ADD CONSTRAINT \`FK_360ad3e31b30b769923aee131d7\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation_users_users\` ADD CONSTRAINT \`FK_5bddbb73e052d228d0138923228\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation_deputies_users\` ADD CONSTRAINT \`FK_1121e5401eb7388de66918b14d6\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation_deputies_users\` ADD CONSTRAINT \`FK_28ba2d7f7e38085542e0e49b28e\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`conversation_deputies_users\` DROP FOREIGN KEY \`FK_28ba2d7f7e38085542e0e49b28e\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation_deputies_users\` DROP FOREIGN KEY \`FK_1121e5401eb7388de66918b14d6\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation_users_users\` DROP FOREIGN KEY \`FK_5bddbb73e052d228d0138923228\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation_users_users\` DROP FOREIGN KEY \`FK_360ad3e31b30b769923aee131d7\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums_medias_medias\` DROP FOREIGN KEY \`FK_95805b23b60c9acd33ccb921fe0\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums_medias_medias\` DROP FOREIGN KEY \`FK_cefaf0fa6136996c4f4d641a898\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_f9053cc87d5bb754cbc6f619537\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_e89cebf7d37c4face022c527935\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_e13972ffe2f26327f658f3811c3\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_c7dc378ca2844fdfe647e00e993\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_232618d03056f5eccc093d39d42\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_43b1012f7fee059597596e8a131\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_6ef8f3de55338d9d0b8ebd4f144\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_ca0a94a1fc09f86dada24760f0f\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_0ca422a52c318ce86181dbf01ed\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7cf4a4df1f2627f72bf6231635f\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_446251f8ceb2132af01b68eb593\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_3cdae851f0b12baae5d6c715f6f\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_ef90ee422970e634bed97a9cde6\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_e3aebe2bd1c53467a07109be596\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_cfd8e81fac09d7339a32e57d904\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_ec3c75d6522fc60e0ebaf58a6b7\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_e2fe567ad8d305fefc918d44f50\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums\` DROP FOREIGN KEY \`FK_8e46da7abb99e39551c42451684\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` DROP FOREIGN KEY \`FK_e2fae7ed063eca039b85d3dc950\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` DROP FOREIGN KEY \`FK_2101227cceb4b41d216fbc0a9eb\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_28ba2d7f7e38085542e0e49b28\` ON \`conversation_deputies_users\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_1121e5401eb7388de66918b14d\` ON \`conversation_deputies_users\``,
    )
    await queryRunner.query(`DROP TABLE \`conversation_deputies_users\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_5bddbb73e052d228d013892322\` ON \`conversation_users_users\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_360ad3e31b30b769923aee131d\` ON \`conversation_users_users\``,
    )
    await queryRunner.query(`DROP TABLE \`conversation_users_users\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_95805b23b60c9acd33ccb921fe\` ON \`albums_medias_medias\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_cefaf0fa6136996c4f4d641a89\` ON \`albums_medias_medias\``,
    )
    await queryRunner.query(`DROP TABLE \`albums_medias_medias\``)
    await queryRunner.query(
      `DROP INDEX \`REL_f9053cc87d5bb754cbc6f61953\` ON \`users\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` ON \`users\``,
    )
    await queryRunner.query(`DROP TABLE \`users\``)
    await queryRunner.query(`DROP TABLE \`friends\``)
    await queryRunner.query(`DROP TABLE \`notification\``)
    await queryRunner.query(
      `DROP INDEX \`REL_6ef8f3de55338d9d0b8ebd4f14\` ON \`medias\``,
    )
    await queryRunner.query(`DROP TABLE \`medias\``)
    await queryRunner.query(`DROP TABLE \`message\``)
    await queryRunner.query(
      `DROP INDEX \`REL_3cdae851f0b12baae5d6c715f6\` ON \`conversation\``,
    )
    await queryRunner.query(
      `DROP INDEX \`REL_ef90ee422970e634bed97a9cde\` ON \`conversation\``,
    )
    await queryRunner.query(`DROP TABLE \`conversation\``)
    await queryRunner.query(`DROP TABLE \`posts\``)
    await queryRunner.query(`DROP TABLE \`comment\``)
    await queryRunner.query(`DROP TABLE \`likes\``)
    await queryRunner.query(`DROP TABLE \`albums\``)
    await queryRunner.query(`DROP TABLE \`request_friend\``)
  }
}
