import { Action, Record } from '@prisma/client';
import { Diff } from '../types';

interface ConstructorProps extends Record {
  diffs: Diff[];
  module: string;
  resource: string;
}

export class RecordDiffEntity {
  id: string;
  code: number;

  creatorEmail: string;
  action: Action;
  entityId: string;
  diffs: Diff[];

  module: string;
  resource: string;

  createdAt: Date;

  constructor(props: ConstructorProps) {
    this.id = props.id;
    this.code = props.code;
    this.creatorEmail = props.creatorEmail;
    this.action = props.action;
    this.entityId = props.entityId;
    this.diffs = props.diffs;

    this.module = props.module;
    this.resource = props.resource;

    this.createdAt = props.createdAt;
  }
}
