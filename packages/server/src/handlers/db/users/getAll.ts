import { camelCase } from 'change-case';

import { Handler } from '../../../types/global';
import { User } from './models';

const mapPropName = camelCase;

const propNamesToLowerCase = (obj: Record<string, unknown>) =>
  Object.entries(obj).reduce(
    (obj, [key, value]) => Object.assign(obj, { [mapPropName(key)]: value }),
    {},
  );

export const getAll: Handler<unknown, User[]> = (ctx, _input) =>
  new Promise((resolve, reject) => {
    return ctx.globals.db.all('SELECT * FROM user', [], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.map(propNamesToLowerCase) as User[]);
    });
  });
