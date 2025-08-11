import { camelCase } from "change-case";

import { Handler } from "../../../types/global";
import { User } from "../../../models/user";

type GetUsersOptions = {
  // Add more fields as needed for filtering or pagination
  departmentId: number;
};

const mapPropName = camelCase;

const propNamesToLowerCase = (obj: Record<string, unknown>) =>
  Object.entries(obj).reduce(
    (obj, [key, value]) => Object.assign(obj, { [mapPropName(key)]: value }),
    {}
  );

export const getAll: Handler<GetUsersOptions, User[]> = (
  ctx,
  { departmentId }
) =>
  new Promise((resolve, reject) => {
    return ctx.globals.db.all(
      "SELECT * FROM user WHERE department_id = ?",
      [departmentId],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.map(propNamesToLowerCase) as User[]);
      }
    );
  });
