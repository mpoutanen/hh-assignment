import { Context } from '../types/global';
import { getById as getDepartmentById } from './db/departments/getDepartmentById';
import { getAll as getAllUsers } from './db/users/getAll';

// Add functions here to extend Context.handlers.
export const handlerTree = {
  db: {
    department: {
      getById: getDepartmentById,
    },
    user: {
      getAll: getAllUsers,
    },
  },
};

export const withHandlerTree = (ctx: Omit<Context, 'handlers'>): Context => ({
  ...ctx,
  handlers: handlerTree,
});
