import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTripsTable1794500000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "trips",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          { name: "driver_id",
             type: "uuid", 
             isNullable: false },

          { name: "vehicle_id",
             type: "uuid",
              isNullable: false },

          { name: "pickup_area_id",
             type: "uuid", 
             isNullable: false },

          { name: "destination_area_id",
             type: "uuid",
              isNullable: false },

          { name: "departure_time",
             type: "timestamptz",
              isNullable: false },

          { name: "distance_km",
             type: "float", 
             isNullable: false },

          { name: "seats_total",
             type: "int",
              isNullable: false },

          { name: "seats_available", 
            type: "int",
             isNullable: false },

          { name: "cost_per_seat",
             type: "int", 
             isNullable: false },

          { name: "status",
             type: "varchar", 
             default: "'scheduled'" },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP(6)",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP(6)",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["driver_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["vehicle_id"],
            referencedTableName: "vehicles",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            columnNames: ["pickup_area_id"],
            referencedTableName: "areas",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            columnNames: ["destination_area_id"],
            referencedTableName: "areas",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
        ],
        indices: [
          { columnNames: ["pickup_area_id"] },
          { columnNames: ["departure_time"] },
        ],
        checks: [
          { name: "CHK_trips_seats_available_min", expression: "seats_available >= 0" },
          { name: "CHK_trips_seats_available_max", expression: "seats_available <= seats_total" },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("trips");
  }
}