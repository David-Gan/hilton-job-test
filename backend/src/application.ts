import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {GraphQLBindings, GraphQLComponent} from '@loopback/graphql';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {EmployeeAuthenticationStrategy} from './auth/employee.strategy';
import {GuestAuthenticationStrategy} from './auth/guest.strategy';
import {GraphqlContext} from './graphql-resolvers/types';
import {bootModels} from './models';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class HiltonQuizApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, GuestAuthenticationStrategy);
    registerAuthenticationStrategy(this, EmployeeAuthenticationStrategy);

    this.component(GraphQLComponent);
    this.configure(GraphQLBindings.GRAPHQL_SERVER).to({asMiddlewareOnly: true});

    const server = this.getSync(GraphQLBindings.GRAPHQL_SERVER);
    this.expressMiddleware('middleware.express.GraphQL', server.expressApp);

    // this.find(i => {
    //   console.log(i.key)
    //   return false
    // })

    // bind user to Graphql Context
    this.bind(GraphQLBindings.GRAPHQL_CONTEXT_RESOLVER).to(async context => {
      const req = context.req
      let guest = null, employee = null

      try {
        const guestAuthenticationStrategy: GuestAuthenticationStrategy
          = await this.get('authentication.strategies.GuestAuthenticationStrategy');
        guest = await guestAuthenticationStrategy.authenticate(req)
      } catch (e) { }

      try {
        const employeeAuthenticationStrategy: EmployeeAuthenticationStrategy
          = await this.get('authentication.strategies.EmployeeAuthenticationStrategy')
        employee = await employeeAuthenticationStrategy.authenticate(req)
      } catch (e) {console.log({e})}

      return {...context, guest, employee};
    });

    this.bind(GraphQLBindings.GRAPHQL_AUTH_CHECKER).to(
      (resolverData, roles) => {
        const {guest, employee} = resolverData.context as GraphqlContext
        if (roles.includes('guest') && guest)
          return true
        if (roles.includes('employee') && employee)
          return true
        return false;
      },
    );

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
      graphqlResolvers: {
        // Customize ControllerBooter Conventions here
        dirs: ['graphql-resolvers'],
        extensions: ['.js'],
        nested: true,
      },
    };
  }

  async boot() {
    await super.boot();
    await bootModels(this)
  }
}
