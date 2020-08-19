import { Test, TestingModule } from '@nestjs/testing';
import { PgConnectService } from './pg-connect.service';

describe('PgConnectService', () => {
  let service: PgConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PgConnectService],
    }).compile();

    service = module.get<PgConnectService>(PgConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
