import { Handler } from "../../../types/global";

export const countById: Handler<number, number> = (ctx, departmentId) =>
  new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) as count FROM user WHERE department_id = ?";
    ctx.globals.db.get(
      sql,
      [departmentId],
      (err: any, row: { count: number }) => {
        if (err) {
          return reject(err);
        }
        resolve(row.count);
      }
    );
  });
