import { Module } from '@nestjs/common';
import { ClassesService } from './services/classes.service';
import { ClassesController } from './controllers/classes.controller';
import { CreateClassService } from './services/create-class/create-class.service';
import { SystemHistoryModule } from '@/system-history/system-history.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { FindAllClassesService } from './services/find-all-classes/find-all-classes.service';

@Module({
  controllers: [ClassesController],
  imports: [PrismaModule, SystemHistoryModule],
  providers: [ClassesService, CreateClassService, FindAllClassesService],
})
export class ClassesModule {}
