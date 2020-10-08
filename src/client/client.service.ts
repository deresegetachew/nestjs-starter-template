import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminApi } from '@oryd/hydra-client';

@Injectable()
export class ClientService {
    private hydraAdmin: AdminApi;

    constructor(private configService: ConfigService) {
        console.log("??", this.configService.get('HYDRA_ADMIN_URL'));
        this.hydraAdmin = new AdminApi(this.configService.get('HYDRA_ADMIN_URL'));
    }



    async getClients() {
        console.log("??", this.configService.get('HYDRA_ADMIN_URL'));
        this.hydraAdmin = new AdminApi({ basePath: this.configService.get('HYDRA_ADMIN_URL') });
        console.log(this.hydraAdmin)
        return this.hydraAdmin.listOAuth2Clients().then(({ data }) => data).catch((err) => { console.log(err); });
    }

}
