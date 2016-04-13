[![Build Status](https://build.theshire.io/buildStatus/icon?job=Frontend%20Build)](https://build.theshire.io/job/Frontend%20Build/)

# Releasing an artifact

Simply commit with the following git commit message : `RELEASE CANDIDATE`. The build server will automatically take the changes and create an official release version (nexus, git tagging, etc).

# How to start

**Note** that this seed project requires node v4.x.x or higher and npm 2.14.7.

In order to start the seed use:

```bash
git clone --depth 1 https://bitbucket.org/the-shire/frontend-web.git
cd theshire-frontend
# install the project's dependencies
npm install
# watches your files and uses livereload by default
npm start
# api document for the app
npm run docs

# dev build
npm run build.dev
# prod build
npm run build.prod
```

_Does not rely on any global dependencies._

For a faster Windows Build use:
```bash
tsc --project tsconfig.json
npm start
```

# Configuration

Default application server configuration

```javascript
var PORT             = 5555;
var LIVE_RELOAD_PORT = 4002;
var DOCS_PORT        = 4003;
var APP_BASE         = '/';
```

Configure at runtime

```bash
npm start -- --port 8080 --reload-port 4000 --base /my-app/
```

# Running tests

```bash
npm test

# Debug - In two different shell windows
npm run build.test.watch      # 1st window
npm run karma.start           # 2nd window

# code coverage (istanbul)
# auto-generated at the end of `npm test`
# view coverage report:
npm run serve.coverage

# e2e (aka. end-to-end, integration) - In three different shell windows
# Make sure you don't have a global instance of Protractor

# npm run webdriver-update <- You will need to run this the first time
npm run webdriver-start
npm run serve.e2e
npm run e2e

# e2e live mode - Protractor interactive mode
# Instead of last command above, you can use:
npm run e2e.live
```
You can learn more about [Protractor Interactive Mode here](https://github.com/angular/protractor/blob/master/docs/debugging.md#testing-out-protractor-interactively)

# Directory Structure

```
.
├── LICENSE
├── README.md
├── gulpfile.ts                <- configuration of the gulp tasks
├── karma.conf.js              <- configuration of the test runner
├── package.json               <- dependencies of the project
├── protractor.conf.js         <- e2e tests configuration
├── src                        <- source code of the application
│   ├── home
│   │   └── components
│   ├── index.html
│   ├── main.ts
│   ├── shared
│   │   └── services
│   │       ├── name-list...
│   │       └── name-list...
│   └── sw.js                  <- sample service worker
├── test-main.js               <- testing configuration
├── tools
│   ├── README.md              <- build documentation
│   ├── config
│   │   ├── project.config.ts  <- configuration of the specific project
│   │   ├── seed.config....
│   │   └── seed.config.ts     <- generic configuration of the seed project
│   ├── config.ts              <- exported configuration (merge both seed.config and project.config, project.config overrides seed.config)
│   ├── debug.ts
│   ├── manual_typings
│   │   ├── project            <- manual ambient typings for the project
│   │   │   └── sample.pac...
│   │   └── seed               <- seed manual ambient typings
│   │       ├── merge-stre..
│   │       └── slash.d.ts
│   ├── tasks                  <- gulp tasks
│   │   ├── project            <- project specific gulp tasks
│   │   │   └── sample.tas...
│   │   └── seed               <- seed generic gulp tasks. They can be overriden by the project specific gulp tasks
│   ├── utils                  <- build utils
│   │   ├── project            <- project specific gulp utils
│   │   │   └── sample_util...
│   │   ├── project.utils.ts
│   │   ├── seed               <- seed specific gulp utils
│   │   │   ├── clean.ts
│   │   │   ├── code_change...
│   │   │   ├── server.ts
│   │   │   ├── tasks_tools.ts
│   │   │   ├── template_loc...
│   │   │   ├── tsproject.ts
│   │   │   └── watch.ts
│   │   └── seed.utils.ts
│   └── utils.ts
├── tsconfig.json              <- configuration of the typescript project (ts-node, which runs the tasks defined in gulpfile.ts)
├── tslint.json                <- tslint configuration
├── typings                    <- typings directory. Contains all the external typing definitions defined with typings
├── typings.json
└── appveyor.yml
```

# Adding an external library
1. Add your dependency to *package.json*
```
  "dependencies": {
    ...
    "angular2-jwt": "^0.1.9",
    ...
  }
```

2. Add the dependency to *karma.conf.js*
```
    files: [
      ...
      { pattern: 'node_modules/angular2-jwt/**/*.js', included: false, watched: false },
      ...

      'test-main.js'
    ]
```

3. Add the dependency to *test-main.js*
```
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

# Making a reference to a backend endpoint
A. Edit *tools/config/project.config.ts*
```
A.1- Add your service url if it does not exists:
  // AUTH-SERVICE PATHS
  AUTHSERVICE_PROD_BASE_URL : string = 'https://region1.theshire.io/api/v1/auth/';
  AUTHSERVICE_DEV_BASE_URL : string = 'http://localhost:17501/';
  
A.2- Add your service url concat function if it does not exists:
  private authService(path : string) : string {
    return (this.ENV === 'prod' ? this.AUTHSERVICE_PROD_BASE_URL : this.AUTHSERVICE_DEV_BASE_URL) + path;
  }

B- Add your endpoint uri:
  // service paths
  ...
  AUTHSERVICE_API_refreshJwtToken = this.authService('token/refresh');
  ...
```

B. Refer in the source to the backend url variable.
```
this._http.post('<%= AUTHSERVICE_API_refreshJwtToken %>' + parameters, '', { headers: headers })
      .map(response => response.json())
      ....
```

C. Rebuild