import { CreatePokemonDto } from './create-pokemon.dto';
import { validate } from 'class-validator';

describe('CreatePokemonDto', () => {
  //* Debe probar que este DTO funciona correctamente con los valores por defecto
  test('should validate with default values', async () => {
    const name = 'Pikachu';
    const type = 'Electric';

    const createPokemonDto = new CreatePokemonDto();
    createPokemonDto.name = name;
    createPokemonDto.type = type;

    const errors = await validate(createPokemonDto);
    // console.log(errors);

    expect(errors.length).toBe(0);
    expect(createPokemonDto.name).toBe(name);
    expect(createPokemonDto.type).toBe(type);
    expect(createPokemonDto.hp).toBeUndefined();
    expect(createPokemonDto.sprites).toBeUndefined();
  });

  //* Debe probar que este DTO funciona correctamente con valores válidos
  test('should validate with valid data', async () => {
    const createPokemonDto = new CreatePokemonDto();
    createPokemonDto.name = 'Pikachu';
    createPokemonDto.type = 'Electric';
    createPokemonDto.hp = 35;
    createPokemonDto.sprites = ['sprite1.png', 'sprite2.png'];

    const errors = await validate(createPokemonDto);
    // console.log(errors);

    expect(errors.length).toBe(0);
  });

  //* Debe probar que el nombre y tipo de Pokémon son obligatorios
  test('should not validate without required fields', async () => {
    const msg = 'should not be empty';

    const createPokemonDto = new CreatePokemonDto();

    const errors = await validate(createPokemonDto);
    // console.log(errors);

    expect(errors.length).toBeGreaterThan(0);

    errors.forEach((error) => {
      if (error.property === 'name') {
        expect(error.constraints?.isNotEmpty).toContain(`name ${msg}`);
      } else if (error.property === 'type') {
        expect(error.constraints?.isNotEmpty).toContain(`type ${msg}`);
      } else {
        throw new Error(`Unexpected error for property: ${error.property}`);
      }
    });
  });

  //* Dbe probar si el campo 'hp' es opcional y debe ser un número no negativo
  test('should validate hp as optional and non-negative number', async () => {
    const msg = 'hp must not be less than 0';
    const createPokemonDto = new CreatePokemonDto();
    createPokemonDto.name = 'Pikachu';
    createPokemonDto.type = 'Electric';
    createPokemonDto.hp = -10; // Invalid hp

    const errors = await validate(createPokemonDto);
    // console.log(errors);

    errors.forEach((error) => {
      if (error.property === 'hp') {
        expect(error.constraints?.min).toContain(msg);
      } else {
        throw new Error(`Unexpected error for property: ${error.property}`);
      }
    });
  });

  //* Debe probar que 'sprites' solamente acepta un array de strings
  test('should validate sprites as optional array of strings', async () => {
    const msg = 'each value in sprites must be a string';

    const createPokemonDto = new CreatePokemonDto();
    createPokemonDto.name = 'Pikachu';
    createPokemonDto.type = 'Electric';
    // Invalid sprites
    createPokemonDto.sprites = [123, 456] as unknown as string[];
    const errors = await validate(createPokemonDto);
    // console.log(errors);

    expect(errors.length).toBeGreaterThan(0);
    errors.forEach((error) => {
      if (error.property === 'sprites') {
        expect(error.constraints?.isString).toContain(msg);
      } else {
        throw new Error(`Unexpected error for property: ${error.property}`);
      }
    });
  });
});
