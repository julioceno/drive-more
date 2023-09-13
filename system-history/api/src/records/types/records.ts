import { Record } from '@prisma/client';

export interface RecordFormatted extends Omit<Record, 'payload'> {
  diffs: Diff[];
}

export interface Diff {
  field: string;
  oldValue: string | null;
  newValue: string;
}
