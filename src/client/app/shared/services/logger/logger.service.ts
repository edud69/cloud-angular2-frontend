import { Injectable } from '@angular/core';

import { Config } from '../../index';

import { LogLevel } from './enums/log-level.enum';


/**
 * Logger Service.
 */
@Injectable()
export class LoggerService {

  private _logLevel : LogLevel;

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
  constructor() {
    if(Config.LOG.LEVEL === 'INFO') {
      this._logLevel =  LogLevel.INFO;
    } else if(Config.LOG.LEVEL === 'ERROR') {
      this._logLevel =  LogLevel.ERROR;
    } else if(Config.LOG.LEVEL === 'WARN') {
      this._logLevel =  LogLevel.WARN;
    } else if(Config.LOG.LEVEL === 'DEBUG') {
      this._logLevel = LogLevel.DEBUG;
    } else if(Config.LOG.LEVEL === 'LOG') {
      this._logLevel = LogLevel.LOG;
    }  else {
      this._logLevel = LogLevel.OFF;
    }
  }

  isLogEnabled() {
    return this._logLevel === LogLevel.LOG;
  }

  isDebugEnabled() {
    return this._logLevel !== LogLevel.OFF && this._logLevel >= LogLevel.DEBUG;
  }

  isInfoEnabled() {
    return this._logLevel !== LogLevel.OFF && this._logLevel >= LogLevel.INFO;
  }

  isWarnEnabled() {
    return this._logLevel !== LogLevel.OFF && this._logLevel >= LogLevel.WARN;
  }

  isErrorEnabled() {
    return this._logLevel !== LogLevel.OFF && this._logLevel >= LogLevel.ERROR;
  }

  /**
   * Log.
   */
  log(message : string, params? : any[]) {
    if(this.isLogEnabled()) {
      console.log(this._formatMessage(LogLevel.LOG, message, params));
    }
  }

  /**
   * Debug.
   */
  debug(message : string, params? : any[]) {
    if(this.isDebugEnabled()) {
      console.debug(this._formatMessage(LogLevel.DEBUG, message, params));
    }
  }

  /**
   * Message.
   */
  info(message : string, params? : any[]) {
    if(this.isInfoEnabled()) {
      console.info(this._formatMessage(LogLevel.INFO, message, params));
    }
  }

  /**
   * Warn.
   */
  warn(message : string, params? : any[]) {
    if(this.isWarnEnabled()) {
      console.warn(this._formatMessage(LogLevel.WARN, message, params));
    }
  }

  /**
   * Error.
   */
  error(message : string, params? : any[]) {
    if(this.isErrorEnabled()) {
      console.error(this._formatMessage(LogLevel.ERROR, message, params));
    }
  }

  private _formatMessage(lvl : LogLevel, message : string, params? : any[]) {
    if(params) {
      let count = 0;
      let formattedMessage = message;

      params.forEach(param => {
        if(param && param instanceof Error) {
          formattedMessage = formattedMessage.replace('{' + count + '}', (<Error>param).message);
        } else if(param && !(typeof(param) === 'string') && !(typeof(param) === 'number') && !(typeof(param) === 'boolean')) {
          formattedMessage = formattedMessage.replace('{' + count + '}', JSON.stringify(param));
        } else {
          formattedMessage = formattedMessage.replace('{' + count + '}', param);
        }

        count++;
      });

      return this._appendTime(`${LogLevel[lvl]} - ${formattedMessage}`);
    }

    return this._appendTime(`${LogLevel[lvl]} - ${message}`);
  }

  private _appendTime(msg : string) {
    let now = new Date();
    let hours = ('00' + now.getHours()).substr(-2);
    let minutes = ('00' + now.getMinutes()).substr(-2);
    let seconds = ('00' + now.getSeconds()).substr(-2);
    let millis = ('000' + now.getMilliseconds()).substr(-3);
    return `${hours}:${minutes}:${seconds}:${millis} - ${msg}`;
  }

}
