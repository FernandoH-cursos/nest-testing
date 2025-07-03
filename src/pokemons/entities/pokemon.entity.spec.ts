import { Pokemon } from './pokemon.entity';

describe('Pokemon Entity', () => {
  test('should create a Pokemon instance with correct properties', () => {
    const mockPokemon: Pokemon = {
      id: 1,
      name: 'Pikachu',
      type: 'Electric',
      hp: 35,
      sprites: ['sprite1.png', 'sprite2.png'],
    };

    const pokemon = new Pokemon();
    pokemon.id = mockPokemon.id;
    pokemon.name = mockPokemon.name;
    pokemon.type = mockPokemon.type;
    pokemon.hp = mockPokemon.hp;
    pokemon.sprites = mockPokemon.sprites;

    expect(pokemon).toBeInstanceOf(Pokemon);
    expect(pokemon).toEqual(mockPokemon);
  });
});
