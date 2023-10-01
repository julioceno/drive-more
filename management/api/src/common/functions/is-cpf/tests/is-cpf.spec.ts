import { isCPF } from '..';

describe('isCPF', () => {
  it('should return cpf is valid', () => {
    expect(isCPF('719.909.690-97')).toBeTruthy();
  });

  it('should return cpf is invalid', () => {
    expect(isCPF('719.909.690-11')).not.toBeTruthy();
  });
});
