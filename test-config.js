// Load our SystemJS configuration.
System.config({
  baseURL: '/base/',
  paths: {
    rxjs: 'node_modules/rxjs',
    lodash: 'node_modules/lodash/lodash.js',
    'angular2-jwt/*': 'node_modules/angular2-jwt/*.js',
    'ng2-completer/*': 'node_modules/ng2-completer/*.js',
    'ng2-file-upload/*': 'node_modules/ng2-file-upload/*.js'
  },
  packages: {
    '': {
      defaultExtension: 'js'
    },
    rxjs: {
      defaultExtension: 'js'
    }
  }
});

