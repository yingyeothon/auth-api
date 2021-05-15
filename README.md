# Auth

A simple Serverless auth API.

## Development

```bash
yarn
yarn deploy
```

### Environment

- `JWT_SECRET_KEY`
- `AWS_PROFILE`

## API docs

### Simple

Request:

```text
POST /simple
{
  "name": string;
  "email": string | undefined;
  "application": string;
}
```

Response: `JWT({name}, 1h)`

Request example with cURL.

```bash
$ curl -XPOST https://API.DOMAIN.TLD/simple -d '{"name":"lacti","email":"lactrious@gmail.com","applications":["test"]}'
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGFjdGkiLCJlbWFpbCI6ImxhY3RyaW91c0BnbWFpbC5jb20iLCJhcHBsaWNhdGlvbnMiOlsidGVzdCJdLCJpYXQiOjE2MjEwNDQyNDIsImV4cCI6MTYyMTA0Nzg0Mn0.SECRET_ENCODED
```

### Google

Request:

```text
POST /google

{
  "token": string;
  "application": string;
}
```

Response: `JWT({name, email}, 7d)`

Request example with cURL.

```bash
$ curl -XPOST https://API.DOMAIN.TLD/google -d '{"token":"GOOGLE_AUTH_TOKEN","applications":["test"]}'
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.PAYLOAD_ENCODED.SECRET_ENCODED
```
