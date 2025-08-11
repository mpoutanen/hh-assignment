import { Database } from 'sqlite3';
import { Department } from '../handlers/db/departments/models';
import { User } from '../handlers/db/users/models';
import { departments, users } from './data';

const departmentToArray = ({ id, name }: Department) => [id, name];

const userToArray = ({ id, departmentId, risk }: User, index: number) => [
  id || index,
  departmentId,
  risk,
];

export const createTables = (db: Database) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS department (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY,
      risk REAL,
      department_id INTEGER NOT NULL,
      FOREIGN KEY (department_id) REFERENCES department(id)
    ) STRICT;
  `;
  return new Promise<void>((resolve, reject) => {
    return db.exec(sql, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const supportedTypes = [
  'string',
  'number',
  'boolean',
  // null type
  'object',
];

const isSupportedType = (value: unknown) =>
  supportedTypes.includes(typeof value);

const jsToSql = (value: string | number | boolean) => {
  switch (typeof value) {
    case 'string':
      return `"${value}"`;
    case 'object':
      return 'null';
    default:
      return value;
  }
};

const jsArrayToSqlValues = (array: unknown[]) =>
  `(${array.filter(isSupportedType).map(jsToSql).join(', ')})`;

const jsArraysToSqlValues = (arrays: unknown[][]) =>
  arrays.map(jsArrayToSqlValues).join(', ');

const executeSql = (sql: string) => (db: Database) =>
  new Promise<Database>((resolve, reject) =>
    db.exec(sql, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve(db);
    }),
  );

const insertDepartments = executeSql(
  `INSERT INTO department (id, name) VALUES ${jsArraysToSqlValues(
    departments.map(departmentToArray),
  )}`,
);

const insertUsers = executeSql(
  `INSERT INTO user (id, department_id, risk) VALUES ${jsArraysToSqlValues(
    users.map(userToArray),
  )}`,
);

export const seedDatabase = (db: Database) =>
  insertDepartments(db).then(insertUsers);
