import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIsVerifiedToUsers1794300000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add the is_verified column to the users table
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "is_verified",
        type: "boolean",
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "is_verified");
  }
}