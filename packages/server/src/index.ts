import config from './config';
import { createResolvers, graphQLSchema } from './graphql';
import { start } from './startup';

const startProject = async () => {
  await start()
    .configure(config)
    .configureHttpServer()
    .startDatabase()
    .then(app => app.configureGraphql(graphQLSchema, createResolvers))
    .then(app => app.startHttpServer());
};

startProject();
