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
