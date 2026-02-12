import { Module, Global } from '@nestjs/common';
import HashingService from '../../domain/ports/hashing.service';
import HashingArgon2Service from '../adapters/hashing-argon2.service';

@Global()
@Module({
  providers: [
    {
      provide: HashingService,
      useClass: HashingArgon2Service,
    },
  ],
  exports: [HashingService],
})
export class SharedModule {}
