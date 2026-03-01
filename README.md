# lifter

Lifting app

## Development

### Backend

#### Spin up a local development instance

- Runs `docker-compose up` with --build each time to include any changes

  ```bash
  pnpm run dev
  ```

#### Spin down the local development instance

- Keeps db volumes

  ```bash
  pnpm run dev:down
  ```

#### Spin down the local development instance

- Removes db volumes

  ```bash
  pnpm run dev:down:clean
  ```
