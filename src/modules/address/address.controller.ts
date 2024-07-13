import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AddressService } from './address.service';
import { AddressResponseDTO } from './dto/address-response.dto';

@ApiTags('address')
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Get('search')
    // @UseGuards(AuthGuard('access'))
    // @ApiBearerAuth()
    @ApiQuery({ name: 'query', required: true, type: String })
    @ApiOperation({ summary: '주소 검색' })
    @ApiOkResponse({ description: '주소 검색 성공', type: AddressResponseDTO })
    async search(@Query('query') query: string): Promise<AddressResponseDTO> {
        return await this.addressService.getSimilarAddress(query);
    }
}
