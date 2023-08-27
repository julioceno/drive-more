import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class CreateLogService {
  constructor(private readonly prismaService: PrismaService) {}

  run(dto: CreateLogDto) {}
}
