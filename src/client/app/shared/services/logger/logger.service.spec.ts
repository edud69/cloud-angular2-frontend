import { ReflectiveInjector } from '@angular/core';
import { LoggerService } from './logger.service';
import { LogLevel } from './enums/log-level.enum';

export function main() {
  describe('Logger Service', () => {

    it('should log at LOG level', () => {
      let loggerService = new LoggerService();
      (<any>loggerService)['_logLevel'] = LogLevel.LOG;
      spyOn(console, 'log');
      let message = 'See {0}, it works!';
      loggerService.log(message, [':-)']);
      expect(console.log).toHaveBeenCalledTimes(1);
    });

    it('should log at DEBUG level', () => {
      let loggerService = new LoggerService();
      (<any>loggerService)['_logLevel'] = LogLevel.DEBUG;
      spyOn(console, 'debug');
      let message = 'See {0}, it works!';
      loggerService.debug(message, [':-)']);
      expect(console.debug).toHaveBeenCalledTimes(1);
    });

    it('should log at INFO level', () => {
      let loggerService = new LoggerService();
      (<any>loggerService)['_logLevel'] = LogLevel.INFO;
      spyOn(console, 'info');
      let message = 'See {0}, it works!';
      loggerService.info(message, [':-)']);
      expect(console.info).toHaveBeenCalledTimes(1);
    });

    it('should log at WARN level', () => {
      let loggerService = new LoggerService();
      (<any>loggerService)['_logLevel'] = LogLevel.WARN;
      spyOn(console, 'warn');
      let message = 'See {0}, it works!';
      loggerService.warn(message, [':-)']);
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it('should log at ERROR level', () => {
      let loggerService = new LoggerService();
      (<any>loggerService)['_logLevel'] = LogLevel.ERROR;
      spyOn(console, 'error');
      let message = 'See {0}, it works!';
      loggerService.error(message, [':-)']);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should not log at lower than ERROR level', () => {
      let loggerService = new LoggerService();
      (<any>loggerService)['_logLevel'] = LogLevel.ERROR;

      spyOn(console, 'error');
      spyOn(console, 'warn');

      let message = 'See {0}, it works!';
      loggerService.error(message, [':-)']);
      expect(console.error).toHaveBeenCalledTimes(1);
      loggerService.warn(message, [':-)']);
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('shoud format the parameters', () => {
      let loggerService = new LoggerService();
      (<any>loggerService)['_logLevel'] = LogLevel.INFO;
      let spy = spyOn(console, 'info');
      let message = 'See {0}, it works! Even with more complex object like this {1}.';
      let expected = 'See :-), it works! Even with more complex object like this [1,2,3,"YO"].';
      loggerService.info(message, [':-)', [1,2,3,'YO']]);
      expect(console.info).toHaveBeenCalled();
      let logStr = <string>(spy.calls.mostRecent().args[0]);
      let logged = logStr.substring(logStr.indexOf('INFO -') + 7, logStr.length)
      expect(logged).toBe(expected);
    });
  });
}
