import { MigrationInterface, QueryRunner } from 'typeorm'

export class User1690619351075 implements MigrationInterface {
  name = 'User1690619351075'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL DEFAULT '', \`username\` varchar(50) NOT NULL DEFAULT '', \`email\` varchar(100) NOT NULL, \`password\` text NOT NULL, \`actived\` tinyint NOT NULL DEFAULT 0, \`status\` varchar(255) NOT NULL DEFAULT 'ACTIVE', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`), INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
  }
}
