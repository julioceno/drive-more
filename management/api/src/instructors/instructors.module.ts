import { Module } from '@nestjs/common';
import { InstructorsController } from './controllers/instructors.controller';
import { InstructorsService } from './services/instructors.service';
import { CreateInstructorService } from './services/create-instructor/create-instructor.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SystemHistoryModule } from '@/system-history/system-history.module';
import { FindAllInstructorsService } from './services/find-all-instructors/find-all-instructors.service';
import { UpdateInstructorService } from './services/update-instructor/update-instructor.service';
import { DeleteInstructorService } from './services/delete-instructor/delete-instructor.service';
import { FindOneInstructorService } from './services/find-one-instructor/find-one-instructor.service';

@Module({
  imports: [PrismaModule, SystemHistoryModule],
  controllers: [InstructorsController],
  providers: [
    InstructorsService,
    CreateInstructorService,
    FindAllInstructorsService,
    UpdateInstructorService,
    DeleteInstructorService,
    FindOneInstructorService,
  ],
})
export class InstructorsModule {}
