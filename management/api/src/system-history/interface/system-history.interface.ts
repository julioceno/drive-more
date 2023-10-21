import { Observable } from 'rxjs';

export interface IGRPCSystemHistoryService {
  create(params: ICreateRecordParams): Observable<any>;
}

export enum ActionEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  OTHER = 'OTHER',
}

export interface ICreateRecordParams {
  creatorEmail: string;
  action: ActionEnum;
  payload: unknown;
  entityId: string | number;
  moduleName: string;
  resourceName: string;
}
