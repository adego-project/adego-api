import { ApiProperty } from '@nestjs/swagger';

type StatusType = 'success' | 'error';

export abstract class ResponseDTO<T = object> {
    @ApiProperty()
    status: StatusType;

    @ApiProperty()
    data: T;
}
