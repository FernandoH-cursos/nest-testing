import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../../src/app.module';
import { Pokemon } from 'src/pokemons/entities/pokemon.entity';

import * as request from 'supertest';

describe('Pokemons (e2e)', () => {
  //* Variable para inicializar la app o modulo a probar con E2E
  let app: INestApplication;

  //* Inicializando el módulo AppModule para E2E Testing
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  //* Probar creación de un pokemon si no se envía un body en el POST
  test('/pokemons (POST) - with no body', async () => {
    const response = await request(app.getHttpServer()).post('/pokemons');

    const errorMsg = 'Bad Request';

    const mostHaveErrorMsg = [
      'name must be a string',
      'name should not be empty',
      'type must be a string',
      'type should not be empty',
    ];

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(errorMsg);

    expect(response.body.message.length).toBe(mostHaveErrorMsg.length);
    expect(response.body.message).toEqual(
      expect.arrayContaining(mostHaveErrorMsg),
    );
  });

  //* Probar creación de un pokemon si se envía un body válido en el POST
  test('/pokemons (POST) - with valid body', async () => {
    const body = {
      name: 'Pikachu',
      type: 'Electric',
    };

    const response = await request(app.getHttpServer())
      .post('/pokemons')
      .send(body);

    const createdPokemon = {
      name: body.name,
      type: body.type,
      id: expect.any(Number),
      hp: 0,
      sprites: [],
    };

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(createdPokemon));
  });

  //* Probar obtencion de pokemones paginados con query params inválidos
  test('/pokemons (GET) - paginated pokemons with no valid query params', async () => {
    const params = {
      page: -10,
      limit: -10,
    };

    const response = await request(app.getHttpServer())
      .get('/pokemons')
      .query(params);

    const errorMsg = 'Bad Request';

    const mostHaveErrorMsg = [
      'page must not be less than 1',
      'limit must not be less than 1',
    ];

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(errorMsg);

    expect(response.body.message.length).toBe(mostHaveErrorMsg.length);
    expect(response.body.message).toEqual(
      expect.arrayContaining(mostHaveErrorMsg),
    );
  });

  //* Probar obtencion de pokemones paginados con query params válidos
  test('/pokemons (GET) - should return 5 paginated pokemons', async () => {
    const params = {
      page: 1,
      limit: 5,
    };

    const response = await request(app.getHttpServer())
      .get('/pokemons')
      .query(params);

    const paginatedPokemons = response.body as Pokemon[];

    expect(response.statusCode).toBe(200);
    expect(paginatedPokemons).toBeInstanceOf(Array);
    expect(paginatedPokemons.length).toEqual(params.limit);

    paginatedPokemons.forEach((pokemon) => {
      expect(pokemon).toHaveProperty('id');
      expect(pokemon).toHaveProperty('name');
      expect(pokemon).toHaveProperty('type');
      expect(pokemon).toHaveProperty('hp');
      expect(pokemon).toHaveProperty('sprites');

      expect(pokemon).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        type: expect.any(String),
        hp: expect.any(Number),
        sprites: expect.any(Array),
      });
    });
  });

  //* Probar obtencion de un pokemon por id
  test('/pokemons/:id (GET) - should return a pokemon by id', async () => {
    const pokemonId = 2;

    const response = await request(app.getHttpServer()).get(
      `/pokemons/${pokemonId}`,
    );

    const pokemon = {
      id: 2,
      name: 'ivysaur',
      type: 'grass',
      hp: 60,
      sprites: expect.any(Array),
    };

    expect(response.statusCode).toBe(200);

    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');
    expect(pokemon).toHaveProperty('type');
    expect(pokemon).toHaveProperty('hp');
    expect(pokemon).toHaveProperty('sprites');

    expect(response.body).toEqual(pokemon);
  });

  //* Probar obtencion de pokemon por id que no existe
  test('/pokemons/:id (GET) - should return not found', async () => {
    const pokemonId = 5_000;

    const response = await request(app.getHttpServer()).get(
      `/pokemons/${pokemonId}`,
    );

    const errorMsg = 'Not Found';

    const pokemonErrorMsg = `Pokemon with id ${pokemonId} not found`;

    expect(response.body).toEqual({
      message: pokemonErrorMsg,
      error: errorMsg,
      statusCode: 404,
    });
  });

  //* Probar actualización de pokemon por id
  test('/pokemons/:id (PATCH) - should throw  an 404', async () => {
    const pokemonId = 5_000;
    const body = {
      name: 'Zubat',
      type: 'Poison',
    };

    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${pokemonId}`)
      .send(body);

    const errorMsg = 'Not Found';

    const pokemonErrorMsg = `Pokemon with id ${pokemonId} not found`;

    expect(response.body).toEqual({
      message: pokemonErrorMsg,
      error: errorMsg,
      statusCode: 404,
    });
  });

  //* Probar actualización de un pokemon si no se envía un body en el PATCH
  test('/pokemons (PATCH) - should keep the same pokemon with no body', async () => {
    const pokemonId = 50;

    const pokemon = {
      id: pokemonId,
      name: 'diglett',
      type: 'ground',
      hp: 10,
      sprites: expect.any(Array),
    };

    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${pokemonId}`)
      .send({});

    expect(response.body).toEqual(pokemon);
  });

  //* Probar actualización de pokemon por id
  test('/pokemons/:id (PATCH) - should update pokemon', async () => {
    const pokemonId = 50;
    const body = {
      name: 'Zubat',
      type: 'Poison',
    };

    const response = await request(app.getHttpServer())
      .patch(`/pokemons/${pokemonId}`)
      .send(body);

    const pokemon = {
      id: pokemonId,
      name: body.name,
      type: body.type,
      hp: 10,
      sprites: expect.any(Array),
    };

    expect(response.body).toEqual(pokemon);
  });

  //* Probar eliminación de un pokemon por id
  test('/pokemons/:id (DELETE) - should delete pokemon', async () => {
    const pokemonId = 10;

    const response = await request(app.getHttpServer()).delete(
      `/pokemons/${pokemonId}`,
    );

    const successMsg = 'Pokemon #caterpie removed';

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(successMsg);
  });

  //* Probar eliminación de un pokemon por id si no existe
  test('/pokemons/:id (DELETE) - should throw  an 404', async () => {
    const pokemonId = 5_000;
    const response = await request(app.getHttpServer()).delete(
      `/pokemons/${pokemonId}`,
    );

    const errorMsg = 'Not Found';

    const pokemonErrorMsg = `Pokemon with id ${pokemonId} not found`;

    expect(response.body).toEqual({
      message: pokemonErrorMsg,
      error: errorMsg,
      statusCode: 404,
    });
  });
});
