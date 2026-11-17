import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateRatingDto } from "./create-rating.dto.js";

import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateRatingDto extends PartialType(
    PickType(CreateRatingDto, ["score", "comment"] as const),
) {
}