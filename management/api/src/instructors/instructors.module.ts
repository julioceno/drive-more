import { Module } from '@nestjs/common';
import { InstructorsController } from './controllers/instructors.controller';
import { InstructorsService } from './services/instructors.service';
import { CreateInstructorService } from './services/create-instructor/create-instructor.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SystemHistoryModule } from '@/system-history/system-history.module';

@Module({
  imports: [PrismaModule, SystemHistoryModule],
  controllers: [InstructorsController],
  providers: [InstructorsService, CreateInstructorService],
})
export class InstructorsModule {}
