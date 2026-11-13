import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Unique
} from "typeorm";


@Entity({ name: "ratings" })

@Unique(
    "UQ_rating_trip_rater_ratee",
    ["trip_id", "rater_id", "ratee_id"]
)

export class Rating {

    @PrimaryGeneratedColumn("uuid")
    id!: string;


    @Column({ type: "uuid" })
    trip_id!: string;


    @Column({ type: "uuid" })
    rater_id!: string;


    @Column({ type: "uuid" })
    ratee_id!: string;


    @Column({ type: "int" })
    score!: number;


    @Column({ type: "text", nullable: true })
    comment?: string;


    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

}