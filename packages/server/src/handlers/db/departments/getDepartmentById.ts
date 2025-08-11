import { camelCase } from 'change-case';

import { Handler } from '../../../types/global';
import { Department } from './models';

const mapPropName = camelCase;

const propNamesToLowerCase = (obj: Record<string, unknown>) =>
  Object.entries(obj).reduce(
    (obj, [key, value]) => Object.assign(obj, { [mapPropName(key)]: value }),
    {},
  );

export const getById: Handler<{ id: number }, Department> = (ctx, input) =>
  new Promise((resolve, reject) => {
    return ctx.globals.db.get(
      'SELECT * FROM department WHERE id = ?',
      [input.id],
      (err: any, result: Department) => {
        if (err) {
          return reject(err);
        }
        if (!result) {
          throw new Error('department not found');
        }
        resolve(propNamesToLowerCase(result) as Department);
      },
    );
  });
