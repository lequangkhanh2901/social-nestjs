import { MigrationInterface, QueryRunner } from 'typeorm'

export class Conversation1699455120659 implements MigrationInterface {
  name = 'Conversation1699455120659'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`conversation\` (\`id\` varchar(36) NOT NULL, \`type\` enum ('GROUP', 'DUAL') NOT NULL, \`status\` enum ('PUBLIC', 'PRIVATE') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`chiefId\` varchar(36) NULL, UNIQUE INDEX \`REL_ef90ee422970e634bed97a9cde\` (\`chiefId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`message\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`status\` enum ('NORMAL', 'EDITED', 'CANCEL') NOT NULL DEFAULT 'NORMAL', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`conversationId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`conversation_users_users\` (\`conversationId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_360ad3e31b30b769923aee131d\` (\`conversationId\`), INDEX \`IDX_5bddbb73e052d228d013892322\` (\`usersId\`), PRIMARY KEY (\`conversationId\`, \`usersId\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`conversation_deputies_users\` (\`conversationId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_1121e5401eb7388de66918b14d\` (\`conversationId\`), INDEX \`IDX_28ba2d7f7e38085542e0e49b28\` (\`usersId\`), PRIMARY KEY (\`conversationId\`, \`usersId\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD \`messageId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` DROP FOREIGN KEY \`FK_2101227cceb4b41d216fbc0a9eb\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` DROP FOREIGN KEY \`FK_e2fae7ed063eca039b85d3dc950\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` CHANGE \`userTargetId\` \`userTargetId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums\` DROP FOREIGN KEY \`FK_8e46da7abb99e39551c42451684\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_e2fe567ad8d305fefc918d44f50\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_ec3c75d6522fc60e0ebaf58a6b7\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_cfd8e81fac09d7339a32e57d904\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` CHANGE \`postId\` \`postId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` CHANGE \`commentId\` \`commentId\` int NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_e3aebe2bd1c53467a07109be596\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`content\` \`content\` text NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`parentId\` \`parentId\` int NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_0ca422a52c318ce86181dbf01ed\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_ca0a94a1fc09f86dada24760f0f\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_6ef8f3de55338d9d0b8ebd4f144\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`relationType\` \`relationType\` enum ('POST', 'COMMENT', 'MESSAGE') NOT NULL DEFAULT 'POST'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`postId\` \`postId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`commentId\` \`commentId\` int NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_f9053cc87d5bb754cbc6f619537\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(50) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`avatarIdId\` \`avatarIdId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_e13972ffe2f26327f658f3811c3\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_e89cebf7d37c4face022c527935\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` CHANGE \`userOneId\` \`userOneId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` CHANGE \`userTwoId\` \`userTwoId\` varchar(36) NULL`,
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
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_ec3c75d6522fc60e0ebaf58a6b7\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_cfd8e81fac09d7339a32e57d904\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_43b1012f7fee059597596e8a131\` FOREIGN KEY (\`messageId\`) REFERENCES \`message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_f9053cc87d5bb754cbc6f619537\` FOREIGN KEY (\`avatarIdId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e13972ffe2f26327f658f3811c3\` FOREIGN KEY (\`userOneId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e89cebf7d37c4face022c527935\` FOREIGN KEY (\`userTwoId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_e89cebf7d37c4face022c527935\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_e13972ffe2f26327f658f3811c3\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_f9053cc87d5bb754cbc6f619537\``,
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
      `ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_ef90ee422970e634bed97a9cde6\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_e3aebe2bd1c53467a07109be596\``,
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
      `ALTER TABLE \`friends\` CHANGE \`userTwoId\` \`userTwoId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` CHANGE \`userOneId\` \`userOneId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e89cebf7d37c4face022c527935\` FOREIGN KEY (\`userTwoId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e13972ffe2f26327f658f3811c3\` FOREIGN KEY (\`userOneId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`avatarIdId\` \`avatarIdId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(50) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_f9053cc87d5bb754cbc6f619537\` FOREIGN KEY (\`avatarIdId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`commentId\` \`commentId\` int NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`postId\` \`postId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`relationType\` \`relationType\` enum ('POST', 'COMMENT') NOT NULL DEFAULT ''POST''`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_6ef8f3de55338d9d0b8ebd4f144\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_ca0a94a1fc09f86dada24760f0f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_0ca422a52c318ce86181dbf01ed\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`parentId\` \`parentId\` int NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` CHANGE \`content\` \`content\` text NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` CHANGE \`commentId\` \`commentId\` int NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` CHANGE \`postId\` \`postId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_cfd8e81fac09d7339a32e57d904\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_ec3c75d6522fc60e0ebaf58a6b7\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_e2fe567ad8d305fefc918d44f50\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums\` ADD CONSTRAINT \`FK_8e46da7abb99e39551c42451684\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` CHANGE \`userTargetId\` \`userTargetId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` ADD CONSTRAINT \`FK_e2fae7ed063eca039b85d3dc950\` FOREIGN KEY (\`userTargetId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` ADD CONSTRAINT \`FK_2101227cceb4b41d216fbc0a9eb\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(`ALTER TABLE \`medias\` DROP COLUMN \`messageId\``)
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
    await queryRunner.query(`DROP TABLE \`message\``)
    await queryRunner.query(
      `DROP INDEX \`REL_ef90ee422970e634bed97a9cde\` ON \`conversation\``,
    )
    await queryRunner.query(`DROP TABLE \`conversation\``)
  }
}
