import { EnvConfig } from './env-config.interface';

const BaseConfig: EnvConfig = {
  // Sample API url
  API: 'https://demo.com',
  LOG: {
    LEVEL: 'WARN',
    STOMPJS_TRAFFIC_LOGGING_ENABLED: false
  }
};

export = BaseConfig;

