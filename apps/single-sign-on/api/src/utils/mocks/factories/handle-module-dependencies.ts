import { InjectionToken } from '@nestjs/common';
import { servicesMocks } from '../services';
import { getMockByFunction } from './get-mock-by-function';

export function handleModuleDependencies(token: InjectionToken) {
  const mock = servicesMocks.find((service) => service.provide === token);
  if (mock) return mock.useValue;
  if (typeof token === 'function') return getMockByFunction(token);
}
