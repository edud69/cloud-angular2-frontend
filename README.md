[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![Build Status](https://travis-ci.org/edud69/cloud-angular2-frontend.svg?branch=master)](https://travis-ci.org/edud69/cloud-angular2-frontend)
[![Dependency Status](https://david-dm.org/edud69/cloud-angular2-frontend.svg)](https://david-dm.org/edud69/cloud-angular2-frontend)
[![devDependency Status](https://david-dm.org/edud69/cloud-angular2-frontend/dev-status.svg)](https://david-dm.org/edud69/cloud-angular2-frontend#info=devDependencies)

# Introduction

This repository is based on [angular-seed](https://github.com/mgechev/angular-seed) repository. Big thanks!

# Contributing

Please see the [CONTRIBUTING](https://github.com/edud69/cloud-angular2-frontend/blob/master/.github/CONTRIBUTING.md) file for guidelines.

# Submitting an issue or feature request

Please see the [ISSUES](https://github.com/edud69/cloud-angular2-frontend/blob/master/.github/ISSUE_TEMPLATE.md) file for guidelines.

# Table of Contents

- [Introduction](#introduction)
- [Contributing](#contributing)
- [Submitting an issue or feature request](#submitting-an-issue-or-feature-request)
- [How to start](#how-to-start)
- [How to start with Aot](#how-to-start-with-aot-compilation)
- [Tree-shaking with Rollup](#tree-shaking-with-rollup)
- [Dockerization](#dockerization)
  + [How to build and start the dockerized version of the application](#how-to-build-and-start-the-dockerized-version-of-the-application)
  + [Development build and deployment](#development-build-and-deployment)
  + [Production build and deployment](#production-build-and-deployment)
- [Analyzing the space usage of the app](#analyzing-the-space-usage-of-the-app)
- [Configuration](#configuration)
- [Environment Configuration](#environment-configuration)
- [Tools documentation](#tools-documentation)
- [Running tests](#running-tests)

Coding tips:
- [Adding a dependency](#adding-an-external-library)
- [Adding a new module to the application](#adding-a-new-module-to-the-application)
- [Securing Routes](#securing-route)
- [Convert backend model to model](#convert-backend-model-to-model)
- [Adding a backend API endpoint](#adding-a-backend-api-endpoint)

Architecture:
- [Directory structure](#directory-structure)
- [Use case flow](#use-case-flow)

Related repositories:
- [Backend Sources](https://github.com/edud69/cloud-backend)
- [Angular Seed](https://github.com/mgechev/angular-seed)

# How to start

**Note** that this seed project requires node v4.x.x or higher and npm 2.14.7 but in order to be able to take advantage of the complete functionality we **strongly recommend node >=v6.5.0 and npm >=3.10.3**.

**Here is how to [speed-up the build on Windows](https://github.com/mgechev/angular-seed/wiki/Speed-up-the-build-on-Windows)**.

In order to start the seed use:


```bash
$ git clone --depth 1 https://github.com/edud69/cloud-angular2-frontend.git
$ cd angular-seed

# install the project's dependencies
$ npm install
# fast install (via Yarn, https://yarnpkg.com)
$ yarn install  # or yarn

# watches your files and uses livereload by default
$ npm start

# generate api documentation
$ npm run compodoc
$ npm run serve.compodoc


# to start deving with livereload site and coverage as well as continuous testing
$ npm run start.deving

# dev build
$ npm run build.dev
# prod build, will output the production application in `dist/prod`
# the produced code can be deployed (rsynced) to a remote server
$ npm run build.prod

# dev build of multiple applications (by default the value of --app is "app")
$ npm start -- --app baz
$ npm start -- --app foo
$ npm start -- --app bar
```
_Does not rely on any global dependencies._

# How to start with AoT compilation

**Note** that AoT compilation requires **node v6.5.0 or higher** and **npm 3.10.3 or higher**.

In order to start the seed with AoT use:

```bash
# prod build with AoT compilation, will output the production application in `dist/prod`
# the produced code can be deployed (rsynced) to a remote server
$ npm run build.prod.aot
```

# Tree-shaking with Rollup

This application provides full support for tree-shaking your production builds with Rollup, which can drastically reduce the size of your application. This is the highest level of optimization currently available.

To run this optimized production build, use:

```bash
# prod build with AoT compilation and Rollup tree-shaking, will output the production application in `dist/prod`
# the produced code can be deployed (rsynced) to a remote server
$ npm run build.prod.rollup.aot
```

Your project will be compiled ahead of time (AOT), and then the resulting bundle will be tree-shaken and minified. During the tree-shaking process Rollup statically analyses your code, and your dependencies, and includes the bare minimum in your bundle.

**Notes**
- Beware of non-static/side-effectful imports. These cannot be properly optimized. For this reason, even though tree-shaking is taking place the developer still needs to be careful not to include non-static imports that are unnecessary, as those referenced imports will always end up in final bundle. Special attention should be given to RxJs, which makes heavy use of non-static/side-effectful imports: make sure you only add the operators you use, as any added operators will be included in your final production bundle.
- UMD modules result in code that cannot be properly optimized. For best results, prefer ES6 modules whenever possible. This includes third-party dependencies: if one is published in both UMD and ES6 modules, go with the ES6 modules version.
- During a production build, CommonJs modules will be automatically converted to ES6 modules. This means you can use them and/or require dependencies that use them without any issues.

# Internationalization

Put `i18n` attribute to your html tag to mark it for translation, more information here: https://angular.io/docs/ts/latest/cookbook/i18n.html

## Create a translation source file

```bash
# Your translation file will be generated here `dist/locale`
$ npm run i18n
```

## Production build with your language

```bash
# Build prod app with the language file `dist/locale/messages.en.xlf`
$ npm run build.prod.rollup.aot -- --lang en
```

# Dockerization

The application provides full Docker support. You can use it for both development as well as production builds and deployments.

## How to build and start the dockerized version of the application

The Dockerization infrastructure is described in the `docker-compose.yml` (respectively `docker-compose.production.yml`.
The application consists of two containers:
- `angular-seed` - In development mode, this container serves the angular app. In production mode it builds the angular app, with the build artifacts being served by the Nginx container
- `angular-seed-nginx` - This container is used only production mode. It serves the built angular app with Nginx.

## Development build and deployment

Run the following:

```bash
$ docker-compose build
$ docker-compose up -d
```

Now open your browser at http://localhost:5555

## Production build and deployment

Run the following:

```bash
$ docker-compose -f docker-compose.production.yml build
$ docker-compose -f docker-compose.production.yml up angular-seed   # Wait until this container has finished building, as the nginx container is dependent on the production build artifacts
$ docker-compose -f docker-compose.production.yml up -d angular-seed-nginx  # Start the nginx container in detached mode
```

Now open your browser at http://localhost:5555

# Analyzing the space usage of the app
You can analyze the bundle with [source-map-explorer](https://github.com/danvk/source-map-explorer).
It creates a html chart with a file by default, but output can also be json or tsv.

Run the following:
```bash
$ npm run sme.prod # or respectively sme.prod.aot / sme.prod.rollup.aot
# You can specify the output format by passing the `sme-out-format` parameter
$ npm run sme.prod.aot -- --sme-out-format json # or html / tsv
```

# Configuration

Default application server configuration

```js
var PORT             = 5555;
var DOCS_PORT        = 4003;
var APP_BASE         = '/';
```

Configure at runtime

```bash
$ npm start -- --port 8080 --base /my-app/
```

## Environment configuration

If you have different environments and you need to configure them to use different end points, settings, etc. you can use the files `dev.ts` or `prod.ts` in`./tools/env/`. The name of the file is environment you want to use.

The environment can be specified by using:

```bash
$ npm start -- --env-config ENV_NAME
```

Currently the `ENV_NAME`s are `dev`, `prod`, `staging`, but you can simply add a different file `"ENV_NAME.ts".` file in order to alter extra such environments.

# Tools documentation

A documentation of the provided tools can be found in [tools/README.md](tools/README.md).

# Running tests

```bash
$ npm test

# Development. Your app will be watched by karma
# on each change all your specs will be executed.
$ npm run test.watch
# NB: The command above might fail with a "EMFILE: too many open files" error.
# Some OS have a small limit of opened file descriptors (256) by default
# and will result in the EMFILE error.
# You can raise the maximum of file descriptors by running the command below:
$ ulimit -n 10480


# code coverage (istanbul)
# auto-generated at the end of `npm test`
# view coverage report:
$ npm run serve.coverage

# e2e (aka. end-to-end, integration) - In three different shell windows
# Make sure you don't have a global instance of Protractor
# Make sure you do have Java in your PATH (required for webdriver)

# npm install webdriver-manager <- Install this first for e2e testing
# npm run webdriver-update <- You will need to run this the first time
$ npm run webdriver-start
$ npm run serve.e2e
$ npm run e2e

# e2e live mode - Protractor interactive mode
# Instead of last command above, you can use:
$ npm run e2e.live
```
You can learn more about [Protractor Interactive Mode here](https://github.com/angular/protractor/blob/master/docs/debugging.md#testing-out-protractor-interactively)

# Adding an external library
A. Add your dependency to *package.json*
```
  "dependencies": {
    ...
    "angular2-jwt": "^0.1.9",
    ...
  }
```

B. Add the dependency to *tools/config/project.config.ts* (here example is with libray ng2-completer)
```typescript
     // Add your dependency in additionalPackages
     let additionalPackages: ExtendPackages[] = [
       ...
       { name: 'YOUR_LIB', path: 'node_modules/PATH_TO_THE_LIB',
         packageMeta: { main: 'ENTRYPOINT.js', defaultExtension: 'js' } },
     ];
```

C. Add the dependency to *karma.conf.js*
```javascript
    files: [
      ...
      // 3rd party libs
      { pattern: 'node_modules/PATH_TO_YOUR_LIB/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/PATH_TO_YOUR_LIB/**/*.js.map', included: false, watched: false },
    ]
```

D. Add the dependency to *test-main.js*
```javascript
System.config({
  baseURL: '/base/',
  defaultJSExtensions: true,
  paths: {
    ...
    'angular2-jwt/*': 'node_modules/angular2-jwt/*.js',
    ...
  }
});
```

E. Add the dependency to *test-config.js'
```typescript
System.config({
  ...
  paths: {
    ...
    'YOUR_LIB/*': 'node_modules/PATH_TO_YOUR_LIB/*.js',
  },
  ...
});
```

# Adding a new module to the application
1. Create your module folder in `$ROOT/src/client/app/your_module_name`.
2. Inside the folder created in 1., make sure you have the `name.module.ts`, `name-routing.module.ts` and `index.ts` configured.
3. You can then edit the two files according to an existing module.

# Securing route
Edit your route file (ex: *module_name/module_name-routine.module.ts*):
A. Case where you want to check against permissions
```typescript
import {PermissionConstants} from '../shared/index'; // IMPORT this, edit the PermissionConstants file if your permission is not there

export const YourModuleRoutes: Route[] = [
  {
    path: '/your/secured/routes',
    component: YourComponent,
    data: {permissions: [PermissionConstants.YOUR_PERM1, PermissionConstants.YOUR_PERM2]} // Add this
  }
];
```

B. Case where you want to validate the user is authenticated (without permission check):
```typescript
export const YourModuleRoutes: Route[] = [
  {
    path: '/your/secured/routes',
    component: YourComponent,
    data: {isAuthenticationRequired: true} // Add this
  }
];
```

# Convert backend model to model
1. In your model class add this line to the very end of the file:
```typescript
import {BaseModel} from '../base.model';
import {ChatMessage} from './chat-message.model';

export class GroupChatMessage extends ChatMessage {

    constructor(_message : string, _senderUsername : string, private _channelName : string) {
        super(_message, _senderUsername);
    }

     get channelName() : string {
         return this._channelName;
     }
}

// bindingClassName: must be the same value as the value that represents the backend model
// targetClass: Provide the current typescript class type
BaseModel.registerType({bindingClassName: 'ChatGroupMsg', targetClass: GroupChatMessage}); // Add this to the end of the file
```

This means that when the backend is sending 'ChatGroupMsg' on the *bindingClassName* json field, it will be resolved as the *targetClass* type.

2 a. To send a model to the backend:
```typescript
yourModel.toJsonString(); // If it extends BaseModel, it will be available
```

2 b. To convert back a json message that is registered with 1. See this example:
```typescript
import {JsonModelConverter} from 'pathToShared/index';

let json : any = JSON.parse(incomingJsonString);
let model : any = JsonModelConverter.fromJson(json); //this returns a BaseModel or null if json was null
if (model instanceof TypingAction) { //now you can test which specific type it is
  callback.onTypingActionReceive(<TypingAction>model); //cast it to your type
}
```

# Adding a backend API endpoint
A. Edit *tools/config/project-backend-api.config.ts*
```typescript
// A.1- Add your service url if it does not exists:
  // AUTH-SERVICE PATHS
  ACCOUNTSERVICE_PROD_BASE_URL : string = 'https://region1.theshire.io/api/v1/account/';
  ACCOUNTSERVICE_DEV_BASE_URL : string = 'http://localhost:8080/api/v1/account/';
  
// A.2- Add your service url concat function if it does not exists:
  private _accountService(path : string) : string {
    return (this._env === 'prod' ? this.ACCOUNTSERVICE_PROD_BASE_URL : this.ACCOUNTSERVICE_DEV_BASE_URL) + path;
  }

// B- Add your endpoint uri:
  // service paths
  ...
  ACCOUNTSERVICE_API_getProfile = this._accountService(''); // here you can add the additional URI path that is needed as a parameter
  ...
```

B. Refer in the source to the backend url variable (use *HttpRestService* for http calls or extend *WebSocketHandlerService* for ws usage).
```typescript
import { HttpUrlUtils } from '../../shared/index';

  getProfile() : IApiResult<Profile> {
    let userId = ...;
    return this._httpRestService.httpGet(HttpUrlUtils.combineId('<%= BACKEND_API.ACCOUNTSERVICE_API_getProfile %>', userId));
  }
```

C. Rebuild

# Directory structure
```
.
├── .docker
│   ├── dist-build.development.dockerfile  <- Dockerfile for development environment
│   └── dist-build.production.dockerfile   <- Dockerfile for production environment
├── .dockerignore              <- ignore file for the docker builds
├── LICENSE
├── README.md
├── appveyor.yml
├── docker-compose.production.yml  <- docker-compose file for production environment
├── docker-compose.yml.        <- docker-compose file for development environment
├── gulpfile.ts                <- configuration of the gulp tasks
├── karma.conf.js              <- configuration of the test runner
├── package.json               <- dependencies of the project
├── protractor.conf.js         <- e2e tests configuration
├── src                        <- source code of the application
│   └── client
│       ├── app
│       │   ├── about
│       │   │   ├── about.component.css
│       │   │   ├── about.component.e2e-spec.ts
│       │   │   ├── about.component.html
│       │   │   ├── about.component.spec.ts
│       │   │   ├── about.component.ts
│       │   │   ├── about.module.ts
│       │   │   └── about-routing.module.ts
│       │   ├── app.component.e2e-spec.ts
│       │   ├── app.component.html
│       │   ├── app.component.spec.ts
│       │   ├── app.component.ts
│       │   ├── app.module.ts
│       │   ├── app.routes.ts
│       │   ├── home
│       │   │   ├── home.component.css
│       │   │   ├── home.component.e2e-spec.ts
│       │   │   ├── home.component.html
│       │   │   ├── home.component.spec.ts
│       │   │   ├── home.component.ts
│       │   │   ├── home.module.ts
│       │   │   └── home-routing.module.ts
│       │   ├── i18n.providers.ts
│       │   ├── main-prod.ts
│       │   ├── main.ts
│       │   ├── operators.ts
│       │   ├── shared
│       │   │   ├── config
│       │   │   │   └── env.config.ts
│       │   │   ├── index.ts
│       │   │   ├── name-list
│       │   │   │   ├── name-list.service.spec.ts
│       │   │   │   └── name-list.service.ts
│       │   │   ├── navbar
│       │   │   │   ├── navbar.component.css
│       │   │   │   ├── navbar.component.html
│       │   │   │   └── navbar.component.ts
│       │   │   ├── shared.module.ts
│       │   │   └── toolbar
│       │   │       ├── toolbar.component.css
│       │   │       ├── toolbar.component.html
│       │   │       └── toolbar.component.ts
│       │   └── system-config.ts
│       ├── assets
│       │   ├── data.json
│       │   └── favicon
│       │       ├── favicon-DEV.ico
│       │       └── favicon-PROD.ico
│       │   └── svg
│       │       └── more.svg
│       ├── css
│       │   └── main.css
│       ├── index.html
│       └── tsconfig.json
├── test-config.js             <- testing configuration
├── test-main.js               <- karma test launcher
├── tools
│   ├── README.md              <- build documentation
│   ├── config
│   │   ├── banner-256.txt
│   │   ├── banner.txt
│   │   ├── project.config.ts  <- configuration of the specific project
│   │   ├── project.tasks.json <- override composite gulp tasks
│   │   ├── seed.config.ts     <- generic configuration of the seed project
│   │   ├── seed.config.interfaces.ts
│   │   ├── seed.tasks.json    <- default composite gulp tasks
│   │   └── seed.tslint.json   <- generic tslint configuration of the seed project
│   ├── config.ts              <- exported configuration (merge both seed.config and project.config, project.config overrides seed.config)
│   ├── debug.ts
│   ├── env                    <- environment configuration
│   │   ├── base.ts
│   │   ├── dev.ts
│   │   ├── env-config.interface.ts
│   │   └── prod.ts
│   ├── manual_typings
│   │   ├── project            <- manual ambient typings for the project
│   │   │   └── sample.package.d.ts
│   │   └── seed               <- seed manual ambient typings
│   │       ├── autoprefixer.d.ts
│   │       ├── cssnano.d.ts
│   │       ├── express-history-api-fallback.d.ts
│   │       ├── istream.d.ts
│   │       ├── karma.d.ts
│   │       ├── merge-stream.d.ts
│   │       ├── open.d.ts
│   │       ├── operators.d.ts
│   │       ├── slash.d.ts
│   │       ├── systemjs-builder.d.ts
│   │       └── tildify.d.ts
│   ├── tasks                  <- gulp tasks
│   │   ├── assets_task.ts
│   │   ├── css_task.ts
│   │   ├── project            <- project specific gulp tasks
│   │   │   └── sample.task.ts
│   │   └── seed               <- seed generic gulp tasks. They can be overriden by the project specific gulp tasks
│   │   │   ├── build.assets.dev.ts
│   │   │   ├── build.assets.prod.ts
│   │   │   ├── build.bundle.rxjs.ts
│   │   │   ├── build.bundles.app.exp.ts
│   │   │   ├── build.bundles.app.ts
│   │   │   ├── build.bundles.ts
│   │   │   ├── build.docs.ts
│   │   │   ├── build.html_css.ts
│   │   │   ├── build.index.dev.ts
│   │   │   ├── build.index.prod.ts
│   │   │   ├── build.js.dev.ts
│   │   │   ├── build.js.e2e.ts
│   │   │   ├── build.js.prod.exp.ts
│   │   │   ├── build.js.prod.ts
│   │   │   ├── build.js.test.ts
│   │   │   ├── build.sme.prod.aot.ts
│   │   │   ├── build.sme.prod.rollup.aot.ts
│   │   │   ├── build.sme.prod.ts
│   │   │   ├── build.tools.ts
│   │   │   ├── check.tools.ts
│   │   │   ├── check.versions.ts
│   │   │   ├── clean.all.ts
│   │   │   ├── clean.coverage.ts
│   │   │   ├── clean.dev.ts
│   │   │   ├── clean.prod.ts
│   │   │   ├── clean.tools.ts
│   │   │   ├── clear.files.ts
│   │   │   ├── compile.ahead.prod.ts
│   │   │   ├── copy.prod.ts
│   │   │   ├── e2e.ts
│   │   │   ├── generate.manifest.ts
│   │   │   ├── karma.run.ts
│   │   │   ├── karma.run.with_coverage.ts
│   │   │   ├── karma.watch.ts
│   │   │   ├── minify.bundles.ts
│   │   │   ├── print.banner.ts
│   │   │   ├── serve.coverage.ts
│   │   │   ├── serve.coverage.watch.ts
│   │   │   ├── serve.docs.ts
│   │   │   ├── server.prod.ts
│   │   │   ├── server.start.ts
│   │   │   ├── start.deving.ts
│   │   │   ├── tslint.ts
│   │   │   ├── watch.dev.ts
│   │   │   ├── watch.e2e.ts
│   │   │   ├── watch.test.ts
│   │   │   └── webdriver.ts
│   │   ├── task.ts
│   │   └── typescript_task.ts
│   ├── utils                  <- build utils
│   │   ├── project            <- project specific gulp utils
│   │   │   └── sample_util.ts
│   │   ├── project.utils.ts
│   │   ├── seed               <- seed specific gulp utils
│   │   │   ├── clean.ts
│   │   │   ├── code_change_tools.ts
│   │   │   ├── karma.start.ts
│   │   │   ├── server.ts
│   │   │   ├── sme.ts
│   │   │   ├── tasks_tools.ts
│   │   │   ├── template_locals.ts
│   │   │   ├── tsproject.ts
│   │   │   └── watch.ts
│   │   └── seed.utils.ts
│   └── utils.ts
├── tsconfig.json              <- configuration of the typescript project (ts-node, which runs the tasks defined in gulpfile.ts)
├── tslint.json                <- tslint configuration
└── yarn.lock
```

# Use case flow
![alt text](https://image.ibb.co/jiqFu5/3067661295_Frontend_Architecture.png)
