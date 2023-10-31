import { MigrationInterface, QueryRunner } from 'typeorm'

export class CascadeLikeOnDeletePost1696920151034
  implements MigrationInterface
{
  name = 'CascadeLikeOnDeletePost1696920151034'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_e2fe567ad8d305fefc918d44f50\``,
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
      `ALTER TABLE \`medias\` CHANGE \`userId\` \`userId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`postId\` \`postId\` varchar(36) NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_f9053cc87d5bb754cbc6f619537\``,
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
      `ALTER TABLE \`request_friend\` ADD CONSTRAINT \`FK_2101227cceb4b41d216fbc0a9eb\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` ADD CONSTRAINT \`FK_e2fae7ed063eca039b85d3dc950\` FOREIGN KEY (\`userTargetId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_0ca422a52c318ce86181dbf01ed\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_ca0a94a1fc09f86dada24760f0f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_f9053cc87d5bb754cbc6f619537\` FOREIGN KEY (\`avatarIdId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e13972ffe2f26327f658f3811c3\` FOREIGN KEY (\`userOneId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e89cebf7d37c4face022c527935\` FOREIGN KEY (\`userTwoId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_ca0a94a1fc09f86dada24760f0f\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_0ca422a52c318ce86181dbf01ed\``,
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
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e89cebf7d37c4face022c527935\` FOREIGN KEY (\`userTwoId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e13972ffe2f26327f658f3811c3\` FOREIGN KEY (\`userOneId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`avatarIdId\` \`avatarIdId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_f9053cc87d5bb754cbc6f619537\` FOREIGN KEY (\`avatarIdId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`postId\` \`postId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_ca0a94a1fc09f86dada24760f0f\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`request_friend\` ADD CONSTRAINT \`FK_e2fae7ed063eca039b85d3dc950\` FOREIGN KEY (\`userTargetId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`request_friend\` ADD CONSTRAINT \`FK_2101227cceb4b41d216fbc0a9eb\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_e2fe567ad8d305fefc918d44f50\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
