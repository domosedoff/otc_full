import { Test, TestingModule } from '@nestjs/testing';
import { FinancialDataService } from './financial-data.service';

describe('FinancialDataService', () => {
  let service: FinancialDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialDataService],
    }).compile();

    service = module.get<FinancialDataService>(FinancialDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
