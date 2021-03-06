import { Injectable } from '@nestjs/common';
import { BlockchainEntity } from 'entities/blockchain.entity';
import { Connection, Repository } from 'typeorm';
import { ApiKeyEntity, ApiKeyRepository } from 'entities/api_keys.entity';

@Injectable()
export class ManageService {
  repositories: {
    blockchain: Repository<BlockchainEntity>;
    apiKeys: ApiKeyRepository;
  };

  constructor(private readonly connection: Connection) {
    this.repositories = {
      blockchain: this.connection.getRepository<BlockchainEntity>(
        BlockchainEntity,
      ),
      apiKeys: this.connection.getCustomRepository<ApiKeyRepository>(
        ApiKeyRepository,
      ),
    };
  }

  getKeys(): Promise<ApiKeyEntity[]> {
    return this.repositories.apiKeys.begin().getMany();
  }

  getBlockchains(currencies?: boolean): Promise<BlockchainEntity[]> {
    let query = this.repositories.blockchain.createQueryBuilder('blockchain');

    if (currencies) {
      query = query.leftJoinAndSelect('blockchain.currencies', 'currency');
    }

    return query.getMany();
  }
}
