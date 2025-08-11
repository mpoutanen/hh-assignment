import { buildSchema } from "graphql";
import { User } from "../models/user";
import { Context } from "../types/global";

// GraphQL schema definition
// Query type would benefit from pagination and filtering in a real-world scenario
// For our needs, we fetch all users based on departmentId

export const graphQLSchema = buildSchema(`

  type Department {
    id: ID!
    name: String!
  }

  type DepartmentSummary {
    id: ID!
    name: String!
    userCount: Int!
  }

  type User {
    id: ID!
    risk: Float
    departmentId: Int!
    department: Department!
  }

  type Query {
    users(departmentId: ID!): [User!]!
    departments: [DepartmentSummary!]!
  }
`);

const addUserResolvers = (ctx: Context) => (users: User[]) =>
  users.map((user) =>
    Object.assign(user, {
      department: () =>
        ctx.handlers.db.department.getById(ctx, {
          id: user.departmentId,
        }),
    })
  );

// Passing in ctx to all resolvers for dependency injection
// All resolvers have access to all handlers and globals
export const createResolvers = (ctx: Context) => ({
  users: () => ctx.handlers.db.user.getAll(ctx, {}).then(addUserResolvers(ctx)),
});
