// Necesario instalar para probar los DTOs con class-validator
import 'reflect-metadata';

import { PaginationDto } from './pagination.dto';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('PaginationDto', () => {
  //* Debe probar que este DTO funciona correctamente con los valores por defecto
  test('should validate with default values', async () => {
    const paginationDto = new PaginationDto();

    // validate es una función de class-validator que valida un objeto y devuelve un array de errores si los hay
    const errors = await validate(paginationDto);
    // console.log(errors);

    expect(errors.length).toBe(0);
    expect(paginationDto.page).toBeUndefined();
    expect(paginationDto.limit).toBeUndefined();
  });

  //* Debe probar que este DTO funciona correctamente con valores válidos
  test('should validate with valid data', async () => {
    const page = 10;
    const limit = 20;

    const paginationDto = new PaginationDto();
    paginationDto.page = page;
    paginationDto.limit = limit;
    // console.log(paginationDto);

    const errors = await validate(paginationDto);

    expect(errors.length).toBe(0);
  });

  //* Debe probar si este DTO viene con un 'page' mínimo invalido
  test('should not validate with invalid page', async () => {
    const invalidPageMsg = 'page must not be less than 1';
    const page = -1;
    const limit = 5;

    const paginationDto = new PaginationDto();
    paginationDto.page = page;
    paginationDto.limit = limit;

    const errors = await validate(paginationDto);
    // console.log(errors);

    expect(errors.length).toBeGreaterThan(0);

    errors.forEach((error) => {
      if (error.property === 'page') {
        expect(errors.at(0).constraints?.min).toContain(invalidPageMsg);
      } else {
        throw new Error(`Unexpected error for property: ${error.property}`);
      }
    });
  });

  //* Debe probar si este DTO viene con un 'limit' mínimo invalido
  test('should not validate with invalid limit', async () => {
    const invalidLimitMsg = 'limit must not be less than 1';
    const page = 1;
    const limit = -5;

    const paginationDto = new PaginationDto();
    paginationDto.page = page;
    paginationDto.limit = limit;

    const errors = await validate(paginationDto);
    // console.log(errors);

    expect(errors.length).toBeGreaterThan(0);

    errors.forEach((error) => {
      if (error.property === 'limit') {
        expect(errors.at(0).constraints?.min).toContain(invalidLimitMsg);
      } else {
        throw new Error(`Unexpected error for property: ${error.property}`);
      }
    });
  });

  //* Debe probar si este DTO convierte correctamente los valores de tipo string a number
  test('should convert string into number', async () => {
    const input = {
      page: '2',
      limit: '10',
    };
    //* 'plainToInstance' convierte un objeto plano a una instancia de la clase lo que permite aplicar
    //* las validaciones de class-transformer
    const paginationDto = plainToInstance(PaginationDto, input);
    // console.log(paginationDto);

    const errors = await validate(paginationDto);
    // console.log(errors);

    expect(errors.length).toBe(0);
    expect(paginationDto.page).toBe(2);
    expect(paginationDto.limit).toBe(10);
  });
});
