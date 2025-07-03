import { Test, TestingModule } from '@nestjs/testing';

import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';

import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

const mockPokemons: Pokemon[] = [
  {
    id: 1,
    name: 'bulbasaur',
    type: 'grass',
    hp: 45,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    ],
  },
  {
    id: 2,
    name: 'ivysaur',
    type: 'grass',
    hp: 60,
    sprites: [
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png',
    ],
  },
];

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [PokemonsService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //* Probar que el método create del controlador llama al servicio con los datos correctos
  test('should have called the service with correct data (create)', async () => {
    const pokemonDto = {
      name: 'bulbasaur',
      type: 'grass',
    };

    jest.spyOn(service, 'create').mockResolvedValue({
      ...pokemonDto,
      id: expect.any(Number),
      hp: 0,
      sprites: [],
    });

    const createdPokemon = await controller.create(pokemonDto);

    expect(service.create).toHaveBeenCalledWith(pokemonDto);
    expect(service.create).toHaveBeenCalledTimes(1);

    expect(createdPokemon).toEqual({
      ...pokemonDto,
      id: expect.any(Number),
      hp: 0,
      sprites: [],
    });
  });

  //* Probar que el método findAll del controlador llama al servicio con los parámetros correctos
  test('should have called the service with correct parameter', async () => {
    const paginationDto: PaginationDto = {
      page: 1,
      limit: 10,
    };

    // Espia el método findAll del servicio para verificar que se llama correctamente
    jest.spyOn(service, 'findAll');
    await controller.findAll(paginationDto);

    expect(service.findAll).toHaveBeenCalledWith(paginationDto);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  //* Probar que el método findAll del controlador devuelve los pokemons esperados
  //* Usamos un mock para simular el resultado del servicio.
  test('should have called the service and check the result', async () => {
    const paginationDto: PaginationDto = {
      page: 1,
      limit: 10,
    };

    // 'mockImplementation' permite simular el comportamiento del método
    // findAll del servicio, devolviendo un array de pokemons mockeados
    /* jest
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(mockPokemons)); */

    // 'mockResolvedValue' simula el resultado del método findAll del servicio,
    // esto es más limpio y directo que usar mockImplementation.
    jest.spyOn(service, 'findAll').mockResolvedValue(mockPokemons);

    const pokemons = await controller.findAll(paginationDto);

    expect(pokemons).toEqual(mockPokemons);
    expect(pokemons.length).toBe(mockPokemons.length);
  });

  //* Probar que el método fineOne del controlador llama al servicio con los datos correctos
  test('should have called the service with correct id (findOne)', async () => {
    const id = 1;

    jest.spyOn(service, 'findOne').mockResolvedValue(mockPokemons[0]);
    const pokemon = await controller.findOne(String(id));

    expect(service.findOne).toHaveBeenCalledWith(id);
    expect(service.findOne).toHaveBeenCalledTimes(1);

    expect(pokemon).toEqual(mockPokemons[0]);
  });

  //* Probar que el método update del controlador llama al servicio con los datos correctos
  test('should have called the service with correct id and data (update)', async () => {
    const id = 1;
    const updatePokemonDto = {
      name: 'updated-bulbasaur',
      type: 'grass',
      hp: 50,
      sprites: [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      ],
    };

    jest.spyOn(service, 'update').mockResolvedValue({
      id,
      ...updatePokemonDto,
    });

    const updatedPokemon = await controller.update(
      String(id),
      updatePokemonDto,
    );

    expect(service.update).toHaveBeenCalledWith(id, updatePokemonDto);
    expect(service.update).toHaveBeenCalledTimes(1);

    expect(updatedPokemon).toEqual({
      id,
      ...updatePokemonDto,
      sprites: expect.any(Array),
    });
  });

  //* Probar que el método remove del controlador llama al servicio con el id correcto
  test('should have called the service with correct id (delete)', async () => {
    const id = 1;
    const msg = `This action removes a #${id} pokemon`;

    jest.spyOn(service, 'remove').mockResolvedValue(msg);

    const removedPokemon = await controller.remove(String(id));

    expect(service.remove).toHaveBeenCalledWith(id);
    expect(service.remove).toHaveBeenCalledTimes(1);

    expect(removedPokemon).toBe(msg);
  });
});
