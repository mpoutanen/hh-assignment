import { Application } from "express";
import { Database } from "sqlite3";
import { handlerTree } from "../handlers";
import { dataLoaders } from "../loaders";

export type AppConfig = {
  port: number;
  databasePath: string;
};

export type Example = {
  name: string;
};

export type Handler<Args extends unknown, ReturnValue extends unknown> = (
  ctx: Context,
  args: Args
) => Promise<ReturnValue>;

export type Context = {
  globals: {
    server: Application;
    db: Database;
    config: AppConfig;
  };
  handlers: typeof handlerTree;
  loaders: ReturnType<typeof dataLoaders>;
};

export type ContextGlobals = Omit<Context, "handlers" | "loaders">;
