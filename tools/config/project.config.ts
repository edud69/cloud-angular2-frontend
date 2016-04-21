import {join} from 'path';
import {SeedConfig} from './seed.config';
import {InjectableDependency} from './seed.config.interfaces';

export class ProjectConfig extends SeedConfig {
  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');


  // API PATHS

  // AUTH-SERVICE PATHS
  AUTHSERVICE_PROD_BASE_URL : string = 'https://region1.theshire.io/api/v1/auth/';
  AUTHSERVICE_DEV_BASE_URL : string = 'http://localhost:17501/';
  // service paths
  AUTHSERVICE_API_facebookLogin = this.authService('signin/facebook');
  AUTHSERVICE_API_login = this.authService('login');
  AUTHSERVICE_API_refreshJwtToken = this.authService('token/refresh');
  AUTHSERVICE_API_userSubscribe = this.authService('user/subscription');
  AUTHSERVICE_API_userSubscribeConfirmation = this.authService('user/subscription/activation');

  // CHAT-SERVICE PATHS
  CHATSERVICE_PROD_BASE_URL : string = 'https://region1.theshire.io/api/v1/chat/';
  CHATSERVICE_DEV_BASE_URL : string = 'http://localhost:17504/';
  // service paths
  CHATSERVICE_API_connect = this.chatService('ws/connect');

  constructor() {
    super();

    this.APP_TITLE = 'The Shire';

    console.info('Using configuration of project: ' + this.APP_TITLE + '.');

    let additional_deps: InjectableDependency[] = [
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    const seedDependencies = this.NPM_DEPENDENCIES;

    this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);
  }

  private authService(path : string) : string {
    return (this.ENV === 'prod' ? this.AUTHSERVICE_PROD_BASE_URL : this.AUTHSERVICE_DEV_BASE_URL) + path;
  }

  private chatService(path : string) : string {
    return (this.ENV === 'prod' ? this.CHATSERVICE_PROD_BASE_URL : this.CHATSERVICE_DEV_BASE_URL) + path;
  }
}
