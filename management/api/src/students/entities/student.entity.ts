import { Student } from '@prisma/client';

interface ConstructorProps extends Student {}

export class StudentEntity {
  id: string;
  code: number;
  name: string;
  cpf: string;

  constructor(props: ConstructorProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.cpf = props.cpf;
  }
}
