import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVerificationsTable1794300000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "verifications",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "document_path",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            default: "'PENDING'",
            isNullable: false,
          },
          {
            name: "admin_note",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP(6)",
          },
          {
            name: "reviewed_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
        // a verification request belongs to one user
        foreignKeys: [
          {
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("verifications");
  }
}