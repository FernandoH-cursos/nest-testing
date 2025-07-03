import { UpdatePokemonDto } from './update-pokemon.dto';

import { validate } from 'class-validator';

describe('UpdatePokemonDto', () => {
  test('should validate with valid data', async () => {
    const updatePokemonDto = new UpdatePokemonDto();

    const errors = await validate(updatePokemonDto);
    // console.log(errors);

    expect(errors.length).toBe(0);
  });
});
