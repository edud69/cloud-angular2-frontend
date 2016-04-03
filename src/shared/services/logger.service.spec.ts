//import {LoggerService} from './logger.service';

export function main() {
  describe('Logger Service', () => {
    let loggerService: string;

    beforeEach(() => {
      loggerService = '';
    });

    it('should test something', () => {
      expect(loggerService).not.toBeNull();
    });
  });
}
