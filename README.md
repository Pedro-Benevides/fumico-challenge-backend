## Descrição

API para o [challenge-backend-fumi.co](https://github.com/fumi-co/fumico-challenge/blob/master/BACKEND.md)

## Tecnologias

- Nestjs
- Typescript
- MySql (Server e Workbench)

## Build da Aplicação

1. Clone o Repositorio

```
   git clone https://github.com/Pedro-Benevides/fumico-challenge-backend.git

```

2. Acesse o diretorio do projeto e instale as dependencias

```
   npm i

```

3. Gere um base64 para o seu JWT_SECRET

```
    openssl rand --base64 32
```

caso não possua o openssl, utilize este [site](https://generate.plus/en/base64)

4. Crie um arquivo _.env_ a partir do .env.example e preencha com os valores das variaveis do seu ambiente e o base64 gerado

<h2 id="variaveis-ambiente">Variáveis de Ambiente</h2>

| Variável    | Descrição                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| DB_DATABASE | Nome da conexão no banco de dados                                                                                           |
| DB_TYPE     | Banco de dados que será utilizado (verifique valores validos na documentação do [TypeORM](https://typeorm.io/#quick-start)) |
| DB_HOST     | Endereço do servidor do banco                                                                                               |
| DB_PORT     | Porta de acesso ao banco                                                                                                    |
| DB_USER     | Usuário de acesso                                                                                                           |
| DB_PASSWORD | Senha de acesso                                                                                                             |
| DB_SYNC     | Ativar sincronizacao com o banco (não recomendado em prod)                                                                  |
| JWT_SECRET  | Base64 para validação JWT                                                                                                   |

5. Inicie o servidor

```
    npm run start
```

para monitorar alterações utilize

```
    npm run start:dev
```
