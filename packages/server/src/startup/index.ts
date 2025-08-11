import R from "ramda";
import express, { Application } from "express";
import cors from "cors";
import { GraphQLSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import sqlite3, { Database } from "sqlite3";
import { AppConfig, Context, ContextGlobals } from "../types/global";
import { withHandlerTree } from "../handlers";
import { withDataLoaders } from "../loaders";

type App = {
  configure: (config: AppConfig) => App;
  configureHttpServer: () => App;
  startDatabase: () => Promise<App>;
  configureGraphql: (
    schema: GraphQLSchema,
    createResolvers: (ctx: Context) => void
  ) => App;
  startHttpServer: () => App;
  config?: AppConfig;
  server?: Application;
  db?: Database;
};

type FNStart = () => App;

const withContextGlobals = (app: App): ContextGlobals => {
  if (!app.db || !app.server || !app.config) {
    throw Error("Unable to create context. Verify your configuration.");
  }
  return {
    globals: { db: app.db, server: app.server, config: app.config },
  };
};

const createContext = (app: App) =>
  R.pipe(withContextGlobals, withDataLoaders, withHandlerTree)(app);

const initializeDatabase = (config: AppConfig) =>
  new Promise<Database>((resolve, reject) => {
    const db = new sqlite3.Database(config.databasePath, (err) => {
      if (err) {
        console.log("Could not connect to database");
        return reject(err);
      }
      console.log("Connected to database");

      db.on("trace", (sql) => {
        console.log("SQL:", sql);
      });

      db.run("PRAGMA foreign_keys = ON;");

      resolve(db);
    });
  });

export const start: FNStart = function () {
  return {
    configure: function (config: AppConfig) {
      this.config = config;
      return this;
    },

    startDatabase: async function () {
      if (!this.config) {
        return this;
      }
      this.db = await initializeDatabase(this.config);
      return this;
    },

    configureHttpServer: function () {
      this.server = express();

      this.server.use(cors());

      return this;
    },

    startHttpServer: function () {
      if (!this.config || !this.server) {
        throw Error("Unable to start http server due to misconfiguration");
      }
      const { port } = this.config;

      this.server.listen(port, () =>
        console.log(`-- Server running at localhost:${port} --`)
      );

      return this;
    },

    configureGraphql: function (schema, createResolvers) {
      if (!this.server) {
        throw Error("Unable to configure graphql due to misconfiguration");
      }

      if (!this.db) {
        throw Error("Database is not initialized");
      }

      // Create request-scoped context
      this.server.use(
        graphqlHTTP(() => {
          const ctx = createContext(this);
          return {
            schema,
            rootValue: createResolvers(ctx),
          };
        })
      );

      return this;
    },
  };
};
