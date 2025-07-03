import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonsModule } from './pokemons/pokemons.module';
import { AppModule } from './app.module';

describe('AppModule', () => {
  //*Declaración de variables para probar el módulo principal de la aplicación
  //* y sus dependencias, como el controlador y el servicio de la aplicación.
  let appController: AppController;
  let appService: AppService;
  let pokemonsModule: PokemonsModule;

  beforeEach(async () => {
    //* Creación de un módulo de prueba que importa el módulo de Pokemons y define el controlador y el servicio de la aplicación.
    //* 'createTestingModule()' es un método de NestJS que permite crear un módulo de prueba.
    //* 'compile()' compila el módulo de prueba y devuelve una instancia del módulo.
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    //* Asignación de las instancias del controlador, servicio y módulo de Pokemons
    //* obtenidas del módulo de prueba.
    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
    pokemonsModule = moduleRef.get<PokemonsModule>(PokemonsModule);
  });

  //* Probar que el módulo de la aplicación está definido y contiene los elementos esperados. Es decir, que el 'AppModule' contenga
  //* el 'AppController', el 'AppService' y el 'PokemonsModule'.
  test('should be defined with proper elements', () => {
    expect(appController).toBeDefined();
    expect(appService).toBeDefined();
    expect(pokemonsModule).toBeDefined();
  });
});
