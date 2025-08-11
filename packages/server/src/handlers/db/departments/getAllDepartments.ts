import { Handler } from "../../../types/global";
import { Department } from "../../../models/department";

export const getAll: Handler<unknown, Department[]> = (ctx, _input) =>
  new Promise((resolve, reject) => {
    return ctx.globals.db.all("SELECT * FROM department", [], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result as Department[]);
    });
  });
