import { Action, Log as LogType, Prisma } from '@prisma/client';

interface ConstructorProps extends LogType {}

export class LogEntity {
  id: string;
  codigo: number;

  creatorEmail: string;
  action: Action;
  entityId: string;
  payload: Prisma.JsonObject;

  createdAt: Date;

  resourceId: string;

  constructor(props: ConstructorProps) {
    this.id = props.id;
    this.codigo = props.codigo;
    this.creatorEmail = props.creatorEmail;
    this.action = props.action;
    this.entityId = props.entityId;
    this.createdAt = props.createdAt;
    this.resourceId = props.resourceId;
  }
}
