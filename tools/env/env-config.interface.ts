// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfig {
  API?: string;
  ENV?: string;
  LOG? : { LEVEL : string; STOMPJS_TRAFFIC_LOGGING_ENABLED : boolean };
}
