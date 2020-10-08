import { Controller, Get } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
    constructor(private clientService: ClientService) { }

    @Get('')
    getClients() {
        return this.clientService.getClients();
    }

}
