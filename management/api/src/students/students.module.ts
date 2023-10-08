import { Module } from '@nestjs/common';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { CreateStudentService } from './services/create-student/create-student.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SystemHistoryModule } from '@/system-history/system-history.module';

@Module({
  imports: [PrismaModule, SystemHistoryModule],
  controllers: [StudentsController],
  providers: [StudentsService, CreateStudentService],
})
export class StudentsModule {}
