// backend/src/investors/investors.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investor } from './entities/investor.entity';
import { TrackInvestorInterestDto } from 'src/emitters/dto/track-investor-interest.dto';
// import { TrackInvestorInterestDto } from '@app/investors/dto/track-investor-interest.dto'; // <-- ИСПРАВЛЕННЫЙ ПУТЬ (АБСОЛЮТНЫЙ)

@Injectable()
export class InvestorsService {
  constructor(
    @InjectRepository(Investor)
    private readonly investorsRepository: Repository<Investor>,
  ) {}

  async createInvestorInterest(
    interestData: TrackInvestorInterestDto,
  ): Promise<Investor> {
    const investor = await this.investorsRepository.findOne({
      where: { email: interestData.email },
    });

    if (investor) {
      investor.name = interestData.name;
      investor.phone = interestData.phone || null;
      return this.investorsRepository.save(investor);
    } else {
      const newInvestor = this.investorsRepository.create(interestData);
      return this.investorsRepository.save(newInvestor);
    }
  }
}
