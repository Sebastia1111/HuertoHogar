// src/utils/validators.test.js
import { describe, it, expect } from 'vitest';
import { validarRun, validarCorreo, validarClave } from './validators';

describe('Pruebas unitarias de validators.js', () => {
  describe('validarRun', () => {
    it('debe aceptar un RUN chileno válido', () => {
      // 19.011.022 tiene DV '2'
      expect(validarRun('19.011.022-2')).toBe('');
      expect(validarRun('190110222')).toBe('');
    });

    it('debe rechazar un RUN con dígito verificador incorrecto', () => {
      expect(validarRun('19011022-0')).toBe('El RUN ingresado no es válido.');
    });

    it('debe solicitar el RUN si el campo está vacío', () => {
      expect(validarRun('')).toBe('El RUN es obligatorio.');
    });
  });

  describe('validarCorreo', () => {
    it('debe permitir correos de dominios válidos (@gmail.com, @duocuc.cl, @huertohogar.cl)', () => {
      expect(validarCorreo('cliente@gmail.com')).toBe('');
      expect(validarCorreo('estudiante@duocuc.cl')).toBe('');
      expect(validarCorreo('admin@huertohogar.cl')).toBe('');
    });

    it('debe rechazar dominios no autorizados', () => {
      expect(validarCorreo('usuario@hotmail.com')).toBe('Solo aceptamos correos @gmail.com, @duocuc.cl o @huertohogar.cl');
    });
  });

  describe('validarClave', () => {
    it('debe validar contraseñas entre 4 y 10 caracteres', () => {
      expect(validarClave('1234')).toBe('');
      expect(validarClave('1234567890')).toBe('');
    });

    it('debe rechazar contraseñas fuera del rango de longitud', () => {
      expect(validarClave('123')).toBe('La contraseña debe tener entre 4 y 10 caracteres.');
      expect(validarClave('12345678901')).toBe('La contraseña debe tener entre 4 y 10 caracteres.');
    });
  });
});