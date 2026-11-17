import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/modules/user/entities/user.entity";
import { Vehicle } from "@/modules/vehicle/entities/vehicle.entity";
import { Area } from "@/modules/area/entities/area.entity";

export enum TripStatus {
    SCHEDULED = "scheduled",
    STARTED = "started",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

@Entity({ name: "trips" })
export class Trip {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    driver_id!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "driver_id" })
    driver?: User;

    @Column()
    vehicle_id!: string;

    @ManyToOne(() => Vehicle, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "vehicle_id" })
    vehicle?: Vehicle;

    @Column()
    pickup_area_id!: string;

    @ManyToOne(() => Area, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "pickup_area_id" })
    pickup_area?: Area;

    @Column()
    destination_area_id!: string;

    @ManyToOne(() => Area, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "destination_area_id" })
    destination_area?: Area;

    @Column({ type: "timestamptz" })
    departure_time!: Date;

    @Column({ type: "float" })
    distance_km!: number;

    @Column()
    seats_total!: number;

    @Column()
    seats_available!: number;

    @Column()
    cost_per_seat!: number;

    @Column({ type: "varchar", default: TripStatus.SCHEDULED })
    status!: TripStatus;

    @Column()
    created_at?: Date;

    @Column()
    updated_at?: Date;
}