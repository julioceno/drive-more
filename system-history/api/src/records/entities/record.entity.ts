import { Action, Prisma, Record } from '@prisma/client';

interface ConstructorProps extends Record {}

export class RecordEntity {
  id: string;
  codigo: number;

  creatorEmail: string;
  action: Action;
  entityId: string;
  payload: Prisma.JsonValue;

  createdAt: Date;

  resourceId: string;

  constructor(props: ConstructorProps) {
    this.id = props.id;
    this.codigo = props.codigo;
    this.creatorEmail = props.creatorEmail;
    this.action = props.action;
    this.entityId = props.entityId;
    this.payload = props.payload;
    this.createdAt = props.createdAt;
    this.resourceId = props.resourceId;
  }
}
