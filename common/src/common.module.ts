import { Module } from '@nestjs/common';
import { ApiModule as FileApiModule } from './clients/nest/file';
import { ApiModule as UserApiModule } from './clients/nest/file';
import { AuthGuard } from './guards/AuthGuard';

@Module({
  exports: [AuthGuard],
  imports: [FileApiModule, UserApiModule],
  providers: [AuthGuard],
})
export class CommonModule {}
