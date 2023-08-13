import { InjectionToken } from '@nestjs/common';
import { handleModuleDependenciesGlobal } from '@/common';
import { servicesMocks } from '../services';

export function handleModuleDependencies(token: InjectionToken) {
  return handleModuleDependenciesGlobal(servicesMocks, token);
}
