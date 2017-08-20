import { async } from '@angular/core/testing';

import { ApiResultFactory, ApiError } from '../index';

export function main() {

  describe('ApiResultFactory Model', () => {

      it('should return an error and complete', async(() => {
          let code = 'an-error-code';
          let message = 'an-error-message';
          let error = new ApiError(code, message);
          let apiResult = ApiResultFactory.createInstantError(error);
          let hasCompleted = false;
          let result : ApiError = null;
          apiResult.subscribe(response => fail('Only an error is possible!'),
                            error => result = error,
                            () => hasCompleted = true);

          expect(result).toBe(error);
          expect(hasCompleted).toBeTruthy();
      }));

  });
}
