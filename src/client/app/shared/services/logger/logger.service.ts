import {Injectable} from 'angular2/core';
import {Logger, Level} from 'angular2-logger/core';

/**
 * Logger Service.
 */
@Injectable()
export class LoggerService {

  // 0.- Level.OFF
  //
  // 1.- Level.ERROR
  //
  // 2.- Level.WARN
  //
  // 3.- Level.INFO
  //
  // 4.- Level.DEBUG
  //
  // 5.- Level.LOG
  constructor(private _logger:Logger) {
    if('<%= ENV %>' === 'dev') {
      _logger.level = Level.DEBUG;
    } else {
      _logger.level = Level.WARN;
    }
  }

  /**
   * Log.
   */
  log(message : string) {
    this._logger.log(message);
  }

  /**
   * Debug.
   */
  debug(message : string) {
    this._logger.debug(message);
  }

  /**
   * Message.
   */
  info(message : string) {
    this._logger.info(message);
  }

  /**
   * Warn.
   */
  warn(message : string) {
    this._logger.warn(message);
  }

  /**
   * Error.
   */
  error(message : string) {
    this._logger.error(message);
  }

}
