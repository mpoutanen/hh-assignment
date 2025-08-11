import DataLoader from "dataloader";
import { Department } from "../models/department";
import { Database } from "sqlite3";
import { Context } from "../types/global";

// Create a DataLoader for departments
// This will batch and cache requests for department data
// It allows to efficiently load department data by ID

export const dataLoaders = (db: Database) => {
  // Function to batch load departments by their IDs
  const batchDepartments = async (ids: readonly number[]) => {
    const sql = `SELECT * FROM department WHERE id IN (${ids
      .map(() => "?")
      .join(",")})`;

    const rows: Department[] = await new Promise((resolve, reject) => {
      db.all(sql, ids, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });

    // Create a map of departments by their ID for quick lookup
    // This allows DataLoader to resolve requests for each ID efficiently
    // If a department is not found, it returns an error for that ID
    const departmentMap = new Map(
      rows.map((department) => [department.id, department])
    );
    return ids.map(
      (id) => departmentMap.get(id) || new Error(`Department ${id} not found`)
    );
  };
  return {
    departmentLoader: new DataLoader(batchDepartments),
  };
};

export const withDataLoaders = (
  ctx: Omit<Context, "loaders" | "handlers">
): Omit<Context, "handlers"> => {
  return {
    ...ctx,
    loaders: dataLoaders(ctx.globals.db),
  };
};
