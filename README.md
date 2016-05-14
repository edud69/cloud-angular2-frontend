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
npm run build.docs

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
│   └── client
│       ├── app
│       │   ├── +about
│       │   │   ├── about.component.css
│       │   │   ├── about.component.e2e-spec.ts
│       │   │   ├── about.component.html
│       │   │   ├── about.component.spec.ts
│       │   │   ├── about.component.ts
│       │   │   └── index.ts
│       │   ├── +home
│       │   │   ├── home.component.css
│       │   │   ├── home.component.e2e-spec.ts
│       │   │   ├── home.component.html
│       │   │   ├── home.component.spec.ts
│       │   │   ├── home.component.ts
│       │   │   └── index.ts
│       │   ├── app.component.e2e-spec.ts
│       │   ├── app.component.html
│       │   ├── app.component.spec.ts
│       │   ├── app.component.ts
│       │   ├── hot_loader_main.ts
│       │   ├── main.ts
│       │   └── shared
│       │       ├── index.ts
│       │       ├── name-list
│       │       │   ├── index.ts
│       │       │   ├── name-list.service.spec.ts
│       │       │   └── name-list.service.ts
│       │       ├── navbar
│       │       │   ├── index.ts
│       │       │   ├── navbar.component.css
│       │       │   ├── navbar.component.html
│       │       │   └── navbar.component.ts
│       │       └── toolbar
│       │           ├── index.ts
│       │           ├── toolbar.component.css
│       │           ├── toolbar.component.html
│       │           └── toolbar.component.ts
│       ├── assets
│       │   └── svg
│       │       └── more.svg
│       ├── css
│       │   └── main.css
│       ├── index.html
│       ├── tsconfig.json
│       └── typings.d.ts
├── test-main.js               <- testing configuration
├── tools
│   ├── README.md              <- build documentation
│   ├── config
│   │   ├── project.config.ts  <- configuration of the specific project
│   │   ├── seed.config.interfaces.ts
│   │   └── seed.config.ts     <- generic configuration of the seed project
│   ├── config.ts              <- exported configuration (merge both seed.config and project.config, project.config overrides seed.config)
│   ├── debug.ts
│   ├── manual_typings
│   │   ├── project            <- manual ambient typings for the project
│   │   │   └── sample.package.d.ts
│   │   └── seed               <- seed manual ambient typings
│   │       ├── angular2-hot-loader.d.ts
│   │       ├── autoprefixer.d.ts
│   │       ├── colorguard.d.ts
│   │       ├── connect-livereload.d.ts
│   │       ├── cssnano.d.ts
│   │       ├── doiuse.d.ts
│   │       ├── express-history-api-fallback.d.ts
│   │       ├── istream.d.ts
│   │       ├── karma.d.ts
│   │       ├── merge-stream.d.ts
│   │       ├── open.d.ts
│   │       ├── postcss-reporter.d.ts
│   │       ├── slash.d.ts
│   │       ├── stylelint.d.ts
│   │       ├── systemjs-builder.d.ts
│   │       ├── tildify.d.ts
│   │       ├── tiny-lr.d.ts
│   │       └── walk.d.ts
│   ├── tasks                  <- gulp tasks
│   │   ├── project            <- project specific gulp tasks
│   │   │   └── sample.task.ts
│   │   └── seed               <- seed generic gulp tasks. They can be overriden by the project specific gulp tasks
│   │       ├── build.assets.dev.ts
│   │       ├── build.assets.prod.ts
│   │       ├── build.bundles.app.ts
│   │       ├── build.bundles.ts
│   │       ├── build.docs.ts
│   │       ├── build.html_css.ts
│   │       ├── build.index.dev.ts
│   │       ├── build.index.prod.ts
│   │       ├── build.js.dev.ts
│   │       ├── build.js.e2e.ts
│   │       ├── build.js.prod.ts
│   │       ├── build.js.test.ts
│   │       ├── build.js.tools.ts
│   │       ├── check.versions.ts
│   │       ├── clean.all.ts
│   │       ├── clean.dev.ts
│   │       ├── clean.prod.ts
│   │       ├── clean.tools.ts
│   │       ├── copy.js.prod.ts
│   │       ├── css-lint.ts
│   │       ├── e2e.ts
│   │       ├── generate.manifest.ts
│   │       ├── karma.start.ts
│   │       ├── serve.coverage.ts
│   │       ├── serve.docs.ts
│   │       ├── server.prod.ts
│   │       ├── server.start.ts
│   │       ├── tslint.ts
│   │       ├── watch.dev.ts
│   │       ├── watch.e2e.ts
│   │       ├── watch.test.ts
│   │       └── webdriver.ts
│   ├── utils                  <- build utils
│   │   ├── project            <- project specific gulp utils
│   │   │   └── sample_util.ts
│   │   ├── project.utils.ts
│   │   ├── seed               <- seed specific gulp utils
│   │   │   ├── clean.ts
│   │   │   ├── code_change_tools.ts
│   │   │   ├── server.ts
│   │   │   ├── tasks_tools.ts
│   │   │   ├── template_locals.ts
│   │   │   ├── tsproject.ts
│   │   │   └── watch.ts
│   │   └── seed.utils.ts
│   └── utils.ts
├── tsconfig.json              <- configuration of the typescript project (ts-node, which runs the tasks defined in gulpfile.ts)
├── tslint.json                <- tslint configuration
├── typings                    <- typings directory. Contains all the external typing definitions defined with typings
├── typings.json
└── appveyor.yml
```

# Adding an external library
A. Add your dependency to *package.json*
```
  "dependencies": {
    ...
    "angular2-jwt": "^0.1.9",
    ...
  }
```

B. Add the dependency to *karma.conf.js*
```
    files: [
      ...
      { pattern: 'node_modules/angular2-jwt/**/*.js', included: false, watched: false },
      ...

      'test-main.js'
    ]
```

C. Add the dependency to *test-main.js*
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

# Adding an auto converter to json message to a strongly-typed model
1. In your model class add this line to the very end of the file:
```
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

BaseModel.registerType({bindingClassName: 'ChatGroupMsg', targetClass: GroupChatMessage}); //ADD THIS TO THE END OF THE FILE
```

This means that when the backend is sending 'ChatGroupMsg' on the *bindingClassName* json field, it will be resolved as the *targetClass* type.

2 a. To send a model to the backend:
```
yourModel.toJsonString(); // If it extends BaseModel, it will be available
```

2 b. To convert back a json message that is registered with 1. See this example:
```
import {JsonModelConverter} from 'pathToShared/index';

let json : any = JSON.parse(incomingJsonString);
let model : any = JsonModelConverter.fromJson(json); //this returns a BaseModel or null if json was null
if (model instanceof TypingAction) { //now you can test which specific type it is
  callback.onTypingActionReceive(<TypingAction>model); //cast it to your type
}
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