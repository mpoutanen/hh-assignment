import { Context } from "../types/global";
import { getById as getDepartmentById } from "./db/departments/getDepartmentById";
import { getAll as getAllUsers } from "./db/users/getAll";
import { countById as countByDepartmentId } from "./db/departments/countByDepartmentId";
import { getAll as getAllDepartments } from "./db/departments/getAllDepartments";

// Add functions here to extend Context.handlers.
export const handlerTree = {
  db: {
    department: {
      getById: getDepartmentById,
      countById: countByDepartmentId,
      getAll: getAllDepartments,
    },
    user: {
      getAll: getAllUsers,
    },
  },
};

export const withHandlerTree = (ctx: Omit<Context, "handlers">): Context => ({
  ...ctx,
  handlers: handlerTree,
});
