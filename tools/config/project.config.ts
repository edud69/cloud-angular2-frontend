import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';
import { ProjectBackendApi } from './project-backend-api.config';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  BACKEND_API : ProjectBackendApi = new ProjectBackendApi(this.BUILD_TYPE);
  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    this.APP_TITLE = 'The Shire';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      {src: `node_modules/@angular/material/prebuilt-themes/indigo-pink.css`, inject: true, vendor: true},
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    // Add packages (e.g. ng2-translate)
     let additionalPackages: ExtendPackages[] = [
       { name: 'lodash', path: 'node_modules/lodash/lodash.js' },
       { name: '@angular/material', path: 'node_modules/@angular/material',
         packageMeta: { main: 'bundles/material.umd.js', defaultExtension: 'js' } },
       { name: '@angular/cdk', path: 'node_modules/@angular/cdk',
         packageMeta: { main: 'bundles/cdk.umd.js', defaultExtension: 'js' } },
       { name: 'ng2-completer', path: 'node_modules/ng2-completer',
         packageMeta: { main: 'ng2-completer.umd.js', defaultExtension: 'js' } },
       { name: 'ng2-file-upload', path: 'node_modules/ng2-file-upload',
         packageMeta: { main: 'bundles/ng2-file-upload.umd.js', defaultExtension: 'js' } },
       { name: 'angular2-jwt', path: 'node_modules/angular2-jwt',
         packageMeta: { main: 'angular2-jwt.js', defaultExtension: 'js' } },
       { name: 'stompjs', path: 'node_modules/stompjs/lib/stomp.js' }
     ];

    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
