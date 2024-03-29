import { Body, Controller, Post } from '@nestjs/common';
import { OAuthTokenDTO } from 'src/dto';

@Controller('/oauth/google')
export class GoogleController {
    constructor() {}

    @Post('login')
    async login(@Body() dto: OAuthTokenDTO) {
        console.log(dto);
    }
}
