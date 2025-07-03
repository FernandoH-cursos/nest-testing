# NestJS + Testing: Pruebas unitarias y end to end (e2e)

Backend de nestJS que utiliza _Jest, supertest, etc_ para crear pruebas unitarias y end to end en varios módulos de la app de __NestJS__. Como lo puede ser los controladores, servicios, DTOs, Pipes, Middlewares, módulos, etc.


## Temas a tratar:

### Pruebas unitarias básicas

- #### Aserciones - Expect.
- #### Agrupadores de pruebas - `describe`.
- #### Pruebas - `it` o `test`.
- #### Pruebas unitarias.
- #### Métodos comparativos como:
  - #### `toBe`
  - #### `toEqual`
  - #### `toBeUndefined`
  - #### `toBeNull`
  - #### `toBeTruthy`
  - #### `toBeFalsy`
  - #### `toContain`
  - #### `toHaveLength`
  - #### `toHaveProperty`
  - #### `toMatchObject`
  - #### `not`
- #### Validaciones sobre decoradores.
- #### Validaciones sobre class transformer.
- #### Objetos literales a instancias de Dtos.
- #### Pruebas sobre Dtos.


### Pruebas sobre módulos, controladores y servicios

- #### Controladores.
- #### Módulos.
- #### Servicios.
- #### _Main - Bootstrap (main.ts)_
- #### Funciones ficticias - Mocks.
- #### Implementaciones ficticias - Mock Implementations.
- #### Implementaciones ficticias de módulos - Mock Modules.
- #### Espías (Spies).
- #### Variables de entorno.


### E2E - End to End Testing

- #### E2E testing.
- #### Cobertura para el E2E.
- #### Supertest.
- #### Query Parameters.
- #### Segmentos de URL.
- #### Buenas practicas.
- #### Ejecutar unit test + E2E antes de construir aplicación.


### Unit Testing - Aplicación real

- #### Mocks.
- #### DTOs.
- #### Requests.
- #### Decoradores personalizados.
- #### Entidades.
- #### Guards.
- #### Espías.
- #### Regresar implementaciones parciales.


### Unit Testing - Autenticación, controladores y strategies
- #### Espias.
- #### Mocks.
- #### Excepciones.
- #### Bcrypt.
- #### Configuraciones y retorno de Mocks.
- #### MockReturn This, para utilizar el patón builder.


### Unit Testing - Productos y carga de archivos
- #### Pruebas sobre Products Service.
- #### Aquí hay varios repositorios y transacciones de DB.
- #### Pruebas sobre UUIDs.
- #### Pruebas sobre QueryRunners, commits y rollbacks.
- #### Métodos de carga de archivos.
- #### Pruebas sobre FilesService.

### Pruebas de extremo a extremoen autenticación, autorización y carga de archivos.
