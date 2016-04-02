import {join} from 'path';
import {SeedConfig} from './seed.config';
import {InjectableDependency} from './seed.config.interfaces';

export class ProjectConfig extends SeedConfig {
  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  // Api urls
  AUTHSERVICE_API_facebookLogin =
    this.ENV === 'prod' ? 'https://region1.theshire.io/api/auth/signin/facebook' : 'http://localhost:17501/signin/facebook';
  AUTHSERVICE_API_login =
    this.ENV === 'prod' ? 'https://region1.theshire.io/api/auth/login' : 'http://localhost:17501/login';
  AUTHSERVICE_API_refreshJwtToken =
    this.ENV === 'prod' ? 'https://region1.theshire.io/api/auth/token/refresh' : 'http://localhost:17501/token/refresh';
  AUTHSERVICE_API_userSubscribe =
    this.ENV === 'prod' ? 'https://region1.theshire.io/api/auth/user/subscription' : 'http://localhost:17501/user/subscription';
  AUTHSERVICE_API_userSubscribeConfirmation =
    this.ENV === 'prod' ?
      'https://region1.theshire.io/api/auth/user/subscription/activation' : 'http://localhost:17501/user/subscription/activation';

  constructor() {
    super();

    this.APP_TITLE = 'The Shire';

    let additional_deps: InjectableDependency[] = [
      {src: 'angular2-jwt/angular2-jwt.js', inject: 'libs'}

      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    const seedDependencies = this.NPM_DEPENDENCIES;

    this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);

    this.APP_ASSETS = [
      // {src: `${this.ASSETS_SRC}/css/toastr.min.css`, inject: true},
      // {src: `${this.APP_DEST}/assets/scss/global.css`, inject: true},
      { src: `${this.ASSETS_SRC}/main.css`, inject: true },
    ];
  }
}
