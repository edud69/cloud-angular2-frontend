import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: 'https://region1.theshire.io/',
  LOG: {
    LEVEL: 'ERROR',
    STOMPJS_TRAFFIC_LOGGING_ENABLED: false
  }
};

export = ProdConfig;

