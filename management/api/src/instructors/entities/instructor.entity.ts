import { Instructor } from '@prisma/client';

interface ConstructorProps extends Instructor {}

export class InstructorEntity {
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
