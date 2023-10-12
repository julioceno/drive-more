import { Module } from '@nestjs/common';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { CreateStudentService } from './services/create-student/create-student.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { SystemHistoryModule } from '@/system-history/system-history.module';
import { FindAllStudentsService } from './services/find-all-students/find-all-students.service';
import { UpdateStudentService } from './services/update-student/update-student.service';
import { DeleteStudentService } from './services/delete-student/delete-student.service';

@Module({
  imports: [PrismaModule, SystemHistoryModule],
  controllers: [StudentsController],
  providers: [
    StudentsService,
    CreateStudentService,
    FindAllStudentsService,
    UpdateStudentService,
    DeleteStudentService,
  ],
})
export class StudentsModule {}
