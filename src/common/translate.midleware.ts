import { I18nService } from '../i18n/i18n.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class translateMiddleware implements NestMiddleware {
    constructor(private i18nService: I18nService) { }

    use(req: Request, res: Response, next: Function) {

        ///???

        next();
    }
}
