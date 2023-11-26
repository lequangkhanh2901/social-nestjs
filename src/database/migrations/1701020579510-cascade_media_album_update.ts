import { MigrationInterface, QueryRunner } from 'typeorm'

export class CascadeMediaAlbumUpdate1701020579510
  implements MigrationInterface
{
  name = 'CascadeMediaAlbumUpdate1701020579510'

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_e347c56b008c2057c9887e230aa\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_d509a93a9c380a3925bf8c917a5\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_4b6fe2df37305bc075a4a16d3ea\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_97372830f2390803a3e2df4a46e\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_a1f0b87d95eb0a4519574d16964\``,
    )
    await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`actions\``)
    await queryRunner.query(`ALTER TABLE \`report\` ADD \`actions\` json NULL`)
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`userTargetId\` \`userTargetId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`postId\` \`postId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`commentId\` \`commentId\` int NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`managerId\` \`managerId\` varchar(36) NULL`,
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
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_4c4e2dd2c76a4f955a2ee84bdd8\``,
    )
    await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`userIds\``)
    await queryRunner.query(`ALTER TABLE \`posts\` ADD \`userIds\` json NULL`)
    await queryRunner.query(
      `ALTER TABLE \`posts\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` CHANGE \`originPostId\` \`originPostId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_ef90ee422970e634bed97a9cde6\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` DROP FOREIGN KEY \`FK_3cdae851f0b12baae5d6c715f6f\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` CHANGE \`name\` \`name\` varchar(30) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` CHANGE \`chiefId\` \`chiefId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` CHANGE \`avatarId\` \`avatarId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_446251f8ceb2132af01b68eb593\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_7cf4a4df1f2627f72bf6231635f\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` CHANGE \`conversationId\` \`conversationId\` varchar(36) NULL`,
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
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_43b1012f7fee059597596e8a131\``,
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
      `ALTER TABLE \`medias\` CHANGE \`messageId\` \`messageId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_232618d03056f5eccc093d39d42\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_c7dc378ca2844fdfe647e00e993\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`userIds\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`userIds\` json NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`userTagetId\` \`userTagetId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`postId\` \`postId\` varchar(36) NULL`,
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
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_f9053cc87d5bb754cbc6f619537\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(50) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`avatarIdId\` \`avatarIdId\` varchar(36) NULL`,
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
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_e347c56b008c2057c9887e230aa\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_d509a93a9c380a3925bf8c917a5\` FOREIGN KEY (\`userTargetId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_4b6fe2df37305bc075a4a16d3ea\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_97372830f2390803a3e2df4a46e\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_a1f0b87d95eb0a4519574d16964\` FOREIGN KEY (\`managerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_4c4e2dd2c76a4f955a2ee84bdd8\` FOREIGN KEY (\`originPostId\`) REFERENCES \`posts\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_4c4e2dd2c76a4f955a2ee84bdd8\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_e3aebe2bd1c53467a07109be596\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_a1f0b87d95eb0a4519574d16964\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_97372830f2390803a3e2df4a46e\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_4b6fe2df37305bc075a4a16d3ea\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_d509a93a9c380a3925bf8c917a5\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_e347c56b008c2057c9887e230aa\``,
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
      `ALTER TABLE \`users\` CHANGE \`avatarIdId\` \`avatarIdId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`username\` \`username\` varchar(50) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_f9053cc87d5bb754cbc6f619537\` FOREIGN KEY (\`avatarIdId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`notification\` CHANGE \`postId\` \`postId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`userTagetId\` \`userTagetId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP COLUMN \`userIds\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD \`userIds\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_c7dc378ca2844fdfe647e00e993\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_232618d03056f5eccc093d39d42\` FOREIGN KEY (\`userTagetId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`messageId\` \`messageId\` varchar(36) NULL DEFAULT 'NULL'`,
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
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_43b1012f7fee059597596e8a131\` FOREIGN KEY (\`messageId\`) REFERENCES \`message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`message\` CHANGE \`conversationId\` \`conversationId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_7cf4a4df1f2627f72bf6231635f\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_446251f8ceb2132af01b68eb593\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` CHANGE \`avatarId\` \`avatarId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` CHANGE \`chiefId\` \`chiefId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` CHANGE \`name\` \`name\` varchar(30) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_3cdae851f0b12baae5d6c715f6f\` FOREIGN KEY (\`avatarId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`conversation\` ADD CONSTRAINT \`FK_ef90ee422970e634bed97a9cde6\` FOREIGN KEY (\`chiefId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` CHANGE \`originPostId\` \`originPostId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`userIds\``)
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD \`userIds\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_4c4e2dd2c76a4f955a2ee84bdd8\` FOREIGN KEY (\`originPostId\`) REFERENCES \`posts\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`report\` CHANGE \`managerId\` \`managerId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`commentId\` \`commentId\` int NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`postId\` \`postId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`userTargetId\` \`userTargetId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`actions\``)
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD \`actions\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_a1f0b87d95eb0a4519574d16964\` FOREIGN KEY (\`managerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_97372830f2390803a3e2df4a46e\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_4b6fe2df37305bc075a4a16d3ea\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_d509a93a9c380a3925bf8c917a5\` FOREIGN KEY (\`userTargetId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`report\` ADD CONSTRAINT \`FK_e347c56b008c2057c9887e230aa\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_ec3c75d6522fc60e0ebaf58a6b7\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
  }
}
