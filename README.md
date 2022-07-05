## Description

O Musicloud é uma rede social com temática de musicas. Usuários podem fazer o upload de suas músicas e escutá-las de qualquer lugar! Criação de playlists, likes em músicas, seguidores e mais!

## Installation

```bash
$ npm install
```

## Running the app without Docker

Configure um arquivo `.env` como indicado no arquivo `.env.example`

```bash
# migrations
$ npx prisma migrate dev

# development watch mode
$ npm run start:dev
```

## Running the app with Docker

Configure um arquivo `.env` como indicado no arquivo `.env.example`

```bash
# migrations
$ npm run docker:migrate

# development watch mode
$ docker-compose up
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Atenção!

Se você modificar seu código e não ver o resultado, tente apagar a pasta `dist` e executar o projeto novamente
