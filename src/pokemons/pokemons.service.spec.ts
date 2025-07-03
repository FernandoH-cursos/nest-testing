import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { PokemonsService } from './pokemons.service';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  //* Probar que se cree un pokemon
  test('should create a new pokemon', async () => {
    const createPokemonDto = { name: 'Pikachu', type: 'Electric' };

    const result = await service.create(createPokemonDto);
    // console.log(result);

    expect(result).toEqual({
      id: expect.any(Number),
      name: createPokemonDto.name,
      type: createPokemonDto.type,
      hp: 0,
      sprites: [],
    });
  });

  //* Probar que se lance un error si el pokemon ya existe al crear uno nuevo
  test('should throw an error if pokemon already exists', async () => {
    const createPokemonDto = { name: 'Pikachu', type: 'Electric' };
    const msg = `Pokemon with name ${createPokemonDto.name} already exists`;

    await service.create(createPokemonDto);
    const result = service.create(createPokemonDto);

    await expect(result).rejects.toThrow(BadRequestException);
    await expect(result).rejects.toThrow(msg);
  });

  //* Probar que devuelva un pokemon por su id
  test('should return pokemon if exists', async () => {
    const pokemonId = 4;

    const mockPokemon = {
      id: 4,
      name: 'charmander',
      type: 'fire',
      hp: 39,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
      ],
    };

    const pokemon = await service.findOne(pokemonId);

    expect(pokemon).toBeDefined();
    expect(pokemon.id).toBe(pokemonId);
    expect(pokemon).toEqual(mockPokemon);
  });

  //* Probar que devuelva un pokemon desde el cache
  test('should return pokemon from cache if available', async () => {
    const pokemonId = 4;

    await service.findOne(pokemonId);

    const cachedPokemon = await service.findOne(pokemonId);

    expect(cachedPokemon).toBeDefined();
    expect(cachedPokemon.id).toBe(pokemonId);
  });

  //* Probar que devuelva error 404 si no existe el pokemon
  test("should return 404 error if pokemon doesn't exist", async () => {
    const pokemonId = 9999; // Non-existent pokemon id
    const errorMsg = `Pokemon with id ${pokemonId} not found`;

    const result = service.findOne(pokemonId);

    await expect(result).rejects.toThrow(NotFoundException);
    await expect(result).rejects.toThrow(errorMsg);
  });

  //* Probar que devuelva una lista de pokemons y que se cachee la respuesta
  test('should find all pokemons and cache them', async () => {
    const { limit, page }: PaginationDto = { page: 1, limit: 10 };

    const pokemons = await service.findAll({ limit, page });

    // Valida que la respuesta sea un array de pokemons
    expect(pokemons).toBeInstanceOf(Array);
    expect(pokemons.length).toBe(limit);

    const cachePokemons = service.paginatedPokemonsCache.get(
      `${page}-${limit}`,
    );

    expect(cachePokemons).toBeTruthy();
    expect(cachePokemons).toEqual(pokemons);
  });

  //* Probar que si los pokemons paginados ya están en caché, no se realice una nueva petición
  test('should return cached pokemons if available', async () => {
    const { limit, page }: PaginationDto = { page: 1, limit: 10 };

    await service.findAll({ limit, page });

    const pokemons = await service.findAll({ limit, page });

    const cachePokemons = service.paginatedPokemonsCache.get(
      `${page}-${limit}`,
    );

    expect(cachePokemons).toBeTruthy();
    expect(cachePokemons).toEqual(pokemons);
  });

  //* Probar que se verifiquen las propiedades del pokemon
  test('should check properties of the pokemon', async () => {
    const pokemonId = 4;

    const pokemon = await service.findOne(pokemonId);

    // Verifica que el resultado tenga las propiedades esperadas
    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');
    expect(pokemon).toHaveProperty('type');
    expect(pokemon).toHaveProperty('hp');
    expect(pokemon).toHaveProperty('sprites');

    expect(pokemon).toEqual(
      expect.objectContaining({
        id: pokemonId,
        name: expect.any(String),
        type: expect.any(String),
        hp: expect.any(Number),
        sprites: expect.arrayContaining([expect.any(String)]),
      }),
    );
  });

  //* Probar que se actualice un pokemon
  test('should update a pokemon', async () => {
    const pokemonId = 4;
    const updatePokemonDto = { name: 'Charmander', type: 'Fire' };

    const updatedPokemon = await service.update(pokemonId, updatePokemonDto);

    expect(updatedPokemon).toEqual({
      id: pokemonId,
      name: updatePokemonDto.name,
      type: updatePokemonDto.type,
      hp: expect.any(Number),
      sprites: expect.arrayContaining([expect.any(String)]),
    });
  });

  //* Probar que se lance un error si el pokemon no existe al actualizar
  test('should throw an error if pokemon does not exist when updating', async () => {
    const pokemonId = 9999;
    const updatePokemonDto = { name: 'NonExistent', type: 'Unknown' };
    const errorMsg = `Pokemon with id ${pokemonId} not found`;

    const result = service.update(pokemonId, updatePokemonDto);

    await expect(result).rejects.toThrow(NotFoundException);
    await expect(result).rejects.toThrow(errorMsg);
  });

  //* Probar que se elimine un pokemon
  test('should delete a pokemon', async () => {
    const pokemonId = 4;
    const msg = `Pokemon #charmander removed`;

    const result = await service.remove(pokemonId);

    expect(result).toBe(msg);
  });

  //* Probar que se lance un error si el pokemon no existe al eliminar
  test('should throw an error if pokemon does not exist when deleting', async () => {
    const pokemonId = 9999;
    const errorMsg = `Pokemon with id ${pokemonId} not found`;

    const result = service.remove(pokemonId);

    await expect(result).rejects.toThrow(NotFoundException);
    await expect(result).rejects.toThrow(errorMsg);
  });

  //* Probar que se elimine un pokemon del cache de pokemons paginados y del cache de pokemons
  test('should delete pokemon from both caches', async () => {
    const pokemonId = 4;
    const paginationDto = { page: 1, limit: 10 };

    // Primero, llenamos ambos caches
    await service.findOne(pokemonId);
    await service.findAll(paginationDto);

    // Verificamos que el pokemon está en el cache paginado
    const cacheKeyBefore = `${paginationDto.page}-${paginationDto.limit}`;

    const paginatedPokemonsBefore =
      service.paginatedPokemonsCache.get(cacheKeyBefore);

    expect(
      paginatedPokemonsBefore?.some((p) => p.id === pokemonId),
    ).toBeTruthy();

    // Eliminamos el pokemon
    await service.remove(pokemonId);

    // Verificamos que el pokemon ya no está en el cache individual
    const cachedPokemon = service.pokemonCache.get(pokemonId);
    expect(cachedPokemon).toBeUndefined();

    // Verificamos que el pokemon ya no está en el cache paginado
    const paginatedPokemonsAfter =
      service.paginatedPokemonsCache.get(cacheKeyBefore);

    expect(paginatedPokemonsAfter?.some((p) => p.id === pokemonId)).toBeFalsy();
  });
});
