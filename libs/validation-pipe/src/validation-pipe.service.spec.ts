import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipeService } from './validation-pipe.service';

describe('ValidationPipeService', () => {
  let service: ValidationPipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationPipeService],
    }).compile();

    service = module.get<ValidationPipeService>(ValidationPipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
