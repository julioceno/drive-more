import { InjectionToken } from '@nestjs/common';
import { getMockByFunction } from './get-mock-by-function';
import { servicesMocks } from '../services';

export function handleModuleDependencies(token: InjectionToken) {
  const mock = servicesMocks.find((service) => service.provide === token);

  if (mock) return mock.useValue;
  if (typeof token === 'function') return getMockByFunction(token);
}
