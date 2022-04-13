import "dotenv/config";
import { ConnectionOptions } from "typeorm";

const myOrmConfig: ConnectionOptions = {
  type: "postgres",
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ["dist/entities/**/*.js"],
  migrations: ["dist/migrations/**/*.js"],
  // logging: true,
  migrationsRun: true,
  cli: {
    migrationsDir: "./src/migrations",
    entitiesDir: "./src/entities",
  },
  synchronize: false,
};

const myProductionConfig: ConnectionOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["dist/entities/**/*.js"],
  migrations: ["dist/migrations/**/*.js"],
  ssl: { rejectUnauthorized: false },
  migrationsRun: true,
  cli: {
    migrationsDir: "./src/migrations",
    entitiesDir: "./src/entities",
  },
  synchronize: false,
};

module.exports = process.env.DATABASE_URL ? myProductionConfig : myOrmConfig;

// "typeorm:sync": "npm run typeorm schema:sync",
// "typeorm:drop": "npm run typeorm schema:drop",
// "typeorm:reset": "npm run typeorm:drop && npm run typeorm:sync",
// "typeorm:migrate": "npm run typeorm migration:generate -- -n",
// "typeorm:create": "npm run typeorm migration:create -- -n initialMigration",
// "typeorm:run": "ts-node -r ts-node/register $(yarn bin typeorm) migration:run"
