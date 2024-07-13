import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { KakaoMapModel } from 'src/common/models/kakao.map.model';

import { AddressResponseDTO } from './dto/address-response.dto';

@Injectable()
export class AddressService {
    private readonly apiKey!: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('KAKAO_REST_API_KEY');
    }

    public async getSimilarAddress(address: string): Promise<AddressResponseDTO> {
        const url = 'https://dapi.kakao.com/v2/local/search/keyword.json';
        const res = await this.httpService.axiosRef.get<KakaoMapModel>(url, {
            params: { query: address },
            headers: { Authorization: `KakaoAK ${this.apiKey}` },
        });

        return {
            documents: res.data.documents
                .map((document) => ({
                    addressName: document.address_name,
                    roadAddressName: document.road_address_name,
                    placeName: document.place_name,
                    x: document.x,
                    y: document.y,
                }))
                .sort((a, b) => a.placeName.localeCompare(b.placeName)),
        };
    }
}
