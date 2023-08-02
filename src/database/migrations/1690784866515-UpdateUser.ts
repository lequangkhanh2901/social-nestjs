import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateUser1690784866515 implements MigrationInterface {
  name = 'UpdateUser1690784866515'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'NORMAL'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`avatar\` varchar(255) NOT NULL DEFAULT ''`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar\``)
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``)
  }
}
