import { ApiProperty } from '@nestjs/swagger';

export class InviteUserDTO {
    @ApiProperty()
    userId: string;
}
