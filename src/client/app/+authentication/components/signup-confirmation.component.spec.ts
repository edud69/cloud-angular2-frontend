import {
  describe,
  expect,
  it
} from 'angular2/testing';
import {Component} from 'angular2/core';
//import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {SignupConfirmationComponent} from './signup-confirmation.component';

export function main() {
  describe('Signup confirmation component', () => {
    it('should work', () => {
        expect(true).toBe(true);
    });
  });
}

@Component({
  selector: 'test-cmp',
  directives: [SignupConfirmationComponent],
  template: '<sd-signup-confirm></sd-signup-confirm>'
})
class TestComponent {}
