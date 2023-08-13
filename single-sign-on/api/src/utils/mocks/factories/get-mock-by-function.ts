import { InjectionToken } from '@nestjs/common';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

/**
 * Isso cria um mocker de todo o modulo e como se fosse atribuido a um objeto global fornecido
 */
const moduleMocker = new ModuleMocker(global);

export function getMockByFunction(token: InjectionToken) {
  /**
   * O getMetadata retorna uma lista de metadados data através do contexto e do mock que esta sendo passado nomomento
   */
  const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<
    any,
    any
  >;

  // Gera um mock com base nos metadados fornecidos
  const Mock = moduleMocker.generateFromMetadata(mockMetadata);
  return new Mock();
}
