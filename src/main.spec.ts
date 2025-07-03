import { NestFactory } from '@nestjs/core';

import { bootstrap } from './main';
import { AppModule } from './app.module';

// Mock para NestFactory y ValidationPipe
jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      setGlobalPrefix: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn(),
    }),
  },
  ValidationPipe: jest.fn().mockImplementation(() => ({
    whitelist: true,
    forbidNonWhitelisted: true,
  })),
}));

describe('main.ts Boostrap', () => {
  let mockApp: {
    setGlobalPrefix: jest.Mock;
    useGlobalPipes: jest.Mock;
    listen: jest.Mock;
  };

  //* Declaración de variables para probar la función bootstrap
  beforeEach(() => {
    mockApp = {
      setGlobalPrefix: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn(),
    };

    //* Mock de NestFactory.create para devolver el mockApp
    NestFactory.create = jest.fn().mockResolvedValue(mockApp);
  });

  //* Probar que la función bootstrap llame al NestFactory.create con el AppModule
  test('should create application', async () => {
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
  });

  //* Probar que la función bootstrap configure el prefijo global
  test('should set global prefix', async () => {
    await bootstrap();

    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
  });

  //* Probar que se levante el servidor con el puerto 3000
  test('should listen on port 3000 if env port not set', async () => {
    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });

  //* Probar que se levante el servidor con el puerto especificado en la variable de entorno PORT
  test('should listen on env port', async () => {
    process.env.PORT = '4200';

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(process.env.PORT);
  });

  //* Probar que se configure el ValidationPipe globalmente
  test('should use global pipes', async () => {
    await bootstrap();

    // Verificar que se haya llamado a useGlobalPipes con una instancia de ValidationPipe
    // usando las configuraciones esperadas
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        errorHttpStatusCode: 400,
        validatorOptions: expect.objectContaining({
          forbidNonWhitelisted: true,
          whitelist: true,
        }),
      }),
    );
  });
});
