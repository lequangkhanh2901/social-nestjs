### Info

| Name       | Version |
| ---------- | ------- |
| Nodejs     | 18.12.1 |
| Nestjs     | 10.0.0  |
| Typescript | 5.1.3   |

## Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

### Dev feature

1. Prettier
2. Husky
3. Eslint

### Feature

#### TypeORM

1.  Create new **migration** :

```bash
$ migration=<migrationName> npm run migration:create

```

2. Generate **migration**:

```bash
$ migration=<migrationName> npm run migration:generate

```

3. Migration to DB :

```bash
$ npm run migration:run

```
