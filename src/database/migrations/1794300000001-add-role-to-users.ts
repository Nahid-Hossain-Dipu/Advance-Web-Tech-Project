import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRoleToUsers1794300000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add the role column to the existing users table
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "role",
        type: "varchar",
        default: "'ROLE_PASSENGER'",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "role");
  }
}