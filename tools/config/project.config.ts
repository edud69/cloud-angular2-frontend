import { join } from 'path';

import { SeedConfig } from './seed.config';
import { InjectableDependency } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');


  // API PATHS
  AUTHSERVICE_PROD_BASE_URL : string = 'https://region1.theshire.io/api/v1/auth/';
  AUTHSERVICE_DEV_BASE_URL : string = 'http://localhost:17501/';
  CHATSERVICE_WS_PROD_BASE_URL : string = 'wss://region1.theshire.io/ws/chat/connect';
  CHATSERVICE_WS_DEV_BASE_URL : string = 'ws://localhost:17504/ws/connect';

  // AUTH-SERVICE PATHS
  AUTHSERVICE_API_facebookLogin = this._authService('signin/facebook');
  AUTHSERVICE_API_googleLogin = this._authService('signin/google');
  AUTHSERVICE_API_login = this._authService('login');
  AUTHSERVICE_API_refreshJwtToken = this._authService('token/refresh');
  AUTHSERVICE_API_userSubscribe = this._authService('user/subscription');
  AUTHSERVICE_API_userSubscribeConfirmation = this._authService('user/subscription/activation');

  // CHAT-SERVICE PATHS
  CHATSERVICE_API_connect = this._chatServiceWS();

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

  private _authService(path : string) : string {
    return (this.ENV === 'prod' ? this.AUTHSERVICE_PROD_BASE_URL : this.AUTHSERVICE_DEV_BASE_URL) + path;
  }

  private _chatServiceWS() : string {
    return (this.ENV === 'prod' ? this.CHATSERVICE_WS_PROD_BASE_URL : this.CHATSERVICE_WS_DEV_BASE_URL);
  }
}
