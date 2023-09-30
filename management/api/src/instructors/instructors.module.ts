import { Module } from '@nestjs/common';
import { InstructorsController } from './controllers/instructors.controller';
import { InstructorsService } from './services/instructors.service';

@Module({
  controllers: [InstructorsController],
  providers: [InstructorsService],
})
export class InstructorsModule {}
