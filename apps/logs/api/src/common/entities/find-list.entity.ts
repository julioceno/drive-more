export class FindListEntity<T> {
  totalCount: number;
  list: T[];

  constructor(totalCount: number, data: T[]) {
    this.totalCount = totalCount;
    this.list = data;
  }
}
