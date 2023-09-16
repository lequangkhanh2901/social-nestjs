import { MigrationInterface, QueryRunner } from 'typeorm'

export class BuildDb1694858846189 implements MigrationInterface {
  name = 'BuildDb1694858846189'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`request_friend\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`userTargetId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`albums\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`type\` enum ('DEFAULT', 'CUSTOM') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`medias\` (\`id\` varchar(36) NOT NULL, \`cdn\` varchar(255) NOT NULL, \`type\` enum ('IMAGE', 'VIDEO') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`postId\` varchar(36) NULL, \`commentId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` varchar(36) NOT NULL, \`id_tree\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`mpath\` varchar(255) NULL DEFAULT '', \`userId\` varchar(36) NULL, \`postId\` varchar(36) NULL, UNIQUE INDEX \`IDX_c225a18ab07adc490aca1ff453\` (\`id_tree\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`posts\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`type\` enum ('PRIVATE', 'PUBLIC', 'ONLY_FRIEND') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL DEFAULT '', \`username\` varchar(50) NOT NULL DEFAULT '', \`email\` varchar(100) NOT NULL, \`password\` text NOT NULL, \`actived\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('ACTIVE', 'BANNED', 'LOCKED') NOT NULL DEFAULT 'ACTIVE', \`role\` enum ('ADMIN', 'MANAGER', 'NORMAL') NOT NULL DEFAULT 'NORMAL', \`avatar\` varchar(255) NOT NULL DEFAULT '', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`), INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`friends\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userOneId\` varchar(36) NULL, \`userTwoId\` varchar(36) NULL, UNIQUE INDEX \`REL_e13972ffe2f26327f658f3811c\` (\`userOneId\`), UNIQUE INDEX \`REL_e89cebf7d37c4face022c52793\` (\`userTwoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE \`albums_medias_medias\` (\`albumsId\` varchar(36) NOT NULL, \`mediasId\` varchar(36) NOT NULL, INDEX \`IDX_cefaf0fa6136996c4f4d641a89\` (\`albumsId\`), INDEX \`IDX_95805b23b60c9acd33ccb921fe\` (\`mediasId\`), PRIMARY KEY (\`albumsId\`, \`mediasId\`)) ENGINE=InnoDB`,
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
      `ALTER TABLE \`medias\` ADD CONSTRAINT \`FK_0ca422a52c318ce86181dbf01ed\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_e2fe567ad8d305fefc918d44f50\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_ec3c75d6522fc60e0ebaf58a6b7\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e13972ffe2f26327f658f3811c3\` FOREIGN KEY (\`userOneId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` ADD CONSTRAINT \`FK_e89cebf7d37c4face022c527935\` FOREIGN KEY (\`userTwoId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums_medias_medias\` ADD CONSTRAINT \`FK_cefaf0fa6136996c4f4d641a898\` FOREIGN KEY (\`albumsId\`) REFERENCES \`albums\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums_medias_medias\` ADD CONSTRAINT \`FK_95805b23b60c9acd33ccb921fe0\` FOREIGN KEY (\`mediasId\`) REFERENCES \`medias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`albums_medias_medias\` DROP FOREIGN KEY \`FK_95805b23b60c9acd33ccb921fe0\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`albums_medias_medias\` DROP FOREIGN KEY \`FK_cefaf0fa6136996c4f4d641a898\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_e89cebf7d37c4face022c527935\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`friends\` DROP FOREIGN KEY \`FK_e13972ffe2f26327f658f3811c3\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_ec3c75d6522fc60e0ebaf58a6b7\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_e2fe567ad8d305fefc918d44f50\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`medias\` DROP FOREIGN KEY \`FK_0ca422a52c318ce86181dbf01ed\``,
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
      `DROP INDEX \`IDX_95805b23b60c9acd33ccb921fe\` ON \`albums_medias_medias\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_cefaf0fa6136996c4f4d641a89\` ON \`albums_medias_medias\``,
    )
    await queryRunner.query(`DROP TABLE \`albums_medias_medias\``)
    await queryRunner.query(
      `DROP INDEX \`REL_e89cebf7d37c4face022c52793\` ON \`friends\``,
    )
    await queryRunner.query(
      `DROP INDEX \`REL_e13972ffe2f26327f658f3811c\` ON \`friends\``,
    )
    await queryRunner.query(`DROP TABLE \`friends\``)
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
    await queryRunner.query(`DROP TABLE \`posts\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_c225a18ab07adc490aca1ff453\` ON \`comment\``,
    )
    await queryRunner.query(`DROP TABLE \`comment\``)
    await queryRunner.query(`DROP TABLE \`likes\``)
    await queryRunner.query(`DROP TABLE \`medias\``)
    await queryRunner.query(`DROP TABLE \`albums\``)
    await queryRunner.query(`DROP TABLE \`request_friend\``)
  }
}
