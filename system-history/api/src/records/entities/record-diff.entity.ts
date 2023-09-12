import { Action, Prisma, Record } from '@prisma/client';

interface ConstructorProps extends Record {
  diffs: any[]; // TODO: corrige
  module: string;
  resource: string;
}

export class RecordDiffEntity {
  id: string;
  code: number;

  creatorEmail: string;
  action: Action;
  entityId: string;
  payload?: Prisma.JsonValue;
  diffs?: any;

  module: string;
  resource: string;

  createdAt: Date;

  constructor(props: ConstructorProps) {
    this.id = props.id;
    this.code = props.code;
    this.creatorEmail = props.creatorEmail;
    this.action = props.action;
    this.entityId = props.entityId;
    this.payload = props.payload;

    this.module = props.module;
    this.resource = props.resource;

    this.createdAt = props.createdAt;
  }
}
