import { ApiProperty } from '@nestjs/swagger';

export class AddressDocument {
    @ApiProperty()
    address_name: string;

    @ApiProperty()
    road_address_name: string;

    @ApiProperty()
    place_name: string;

    @ApiProperty()
    x: string;

    @ApiProperty()
    y: string;
}

export class AddressResponseDTO {
    @ApiProperty()
    documents: AddressDocument[];
}
