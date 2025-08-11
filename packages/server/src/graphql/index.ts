import { buildSchema } from 'graphql';
import { User } from '../handlers/db/users/models';
import { Context } from '../types/global';

export const graphQLSchema = buildSchema(`

  type Department {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    risk: Float
    departmentId: Int!
    department: Department!
  }

  type Query {
    users: [User!]!
  }
`);

const addUserResolvers = (ctx: Context) => (users: User[]) =>
  users.map(user =>
    Object.assign(user, {
      department: () =>
        ctx.handlers.db.department.getById(ctx, {
          id: user.departmentId,
        }),
    }),
  );

// Passing in ctx to all resolvers for dependency injection
// All resolvers have access to all handlers and globals
export const createResolvers = (ctx: Context) => ({
  users: () => ctx.handlers.db.user.getAll(ctx, {}).then(addUserResolvers(ctx)),
});
