import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

import { PokeapiResponse } from './interfaces/pokeapi.response';
import { PokeapiPokemonResponse } from './interfaces/pokeapi-pokemon.response';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonsService {
  public paginatedPokemonsCache = new Map<string, Pokemon[]>();
  public pokemonCache = new Map<number, Pokemon>();

  private async getPokemonInformation(id: number): Promise<Pokemon> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok)
      throw new NotFoundException(`Pokemon with id ${id} not found`);

    const data = (await response.json()) as PokeapiPokemonResponse;

    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    };
  }

  async create(createPokemonDto: CreatePokemonDto) {
    const pokemon: Pokemon = {
      ...createPokemonDto,
      id: new Date().getTime(),
      hp: createPokemonDto.hp ?? 0,
      sprites: createPokemonDto.sprites ?? [],
    };

    // Validar si el pokemon ya existe en el cache
    this.pokemonCache.forEach((storedPokemon) => {
      if (storedPokemon.name === pokemon.name) {
        throw new BadRequestException(
          `Pokemon with name ${pokemon.name} already exists`,
        );
      }
    });

    this.pokemonCache.set(pokemon.id, pokemon);

    return Promise.resolve(pokemon);
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    const cacheKey = `${page}-${limit}`;
    if (this.paginatedPokemonsCache.has(cacheKey)) {
      return this.paginatedPokemonsCache.get(cacheKey)!;
    }

    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    const response = await fetch(url);
    const data = (await response.json()) as PokeapiResponse;

    const pokemonPromises = data.results.map((result) => {
      const url = result.url;
      const id = url.split('/').at(-2)!;

      return this.getPokemonInformation(Number(id));
    });

    const pokemons = await Promise.all(pokemonPromises);

    this.paginatedPokemonsCache.set(cacheKey, pokemons);

    return pokemons;
  }

  async findOne(id: number) {
    if (this.pokemonCache.has(id)) {
      return this.pokemonCache.get(id)!;
    }

    const pokemon = await this.getPokemonInformation(id);

    this.pokemonCache.set(id, pokemon);

    return pokemon;
  }

  async update(id: number, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    const updatedPokemon: Pokemon = {
      ...pokemon,
      ...updatePokemonDto,
    };

    this.pokemonCache.set(id, updatedPokemon);

    return Promise.resolve(updatedPokemon);
  }

  async remove(id: number) {
    const pokemon = await this.findOne(id);

    this.pokemonCache.delete(id);

    this.paginatedPokemonsCache.forEach((pokemons, key) => {
      // Filtrar los pokemons para eliminar el que tiene el id especificado
      this.paginatedPokemonsCache.set(
        key,
        pokemons.filter((p) => p.id !== id),
      );
    });

    return Promise.resolve(`Pokemon #${pokemon.name} removed`);
  }
}
