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
      // Use DataLoader pattern to batch load departments
      department: () => ctx.loaders.departmentLoader.load(user.departmentId),
    })
  );

const addDepartmentResolvers =
  (ctx: Context) => (departments: { id: number }[]) =>
    departments.map((department) =>
      Object.assign(department, {
        userCount: () =>
          ctx.handlers.db.department.countById(ctx, department.id),
      })
    );

// Passing in ctx to all resolvers for dependency injection
// All resolvers have access to all handlers and globals
export const createResolvers = (ctx: Context) => ({
  users: (args: { departmentId: number }) => {
    return ctx.handlers.db.user
      .getAll(ctx, { departmentId: args.departmentId })
      .then(addUserResolvers(ctx));
  },
});
