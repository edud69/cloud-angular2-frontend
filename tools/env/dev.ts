import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  API: 'http://localhost:8080/',
  LOG: {
    LEVEL: 'LOG',
    STOMPJS_TRAFFIC_LOGGING_ENABLED: false
  }
};

export = DevConfig;

