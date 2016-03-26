import {
  describe,
  expect,
  it
} from 'angular2/testing';
import {Component} from 'angular2/core';
//import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {LoginComponent} from './login.component';

export function main() {
  describe('Login component', () => {
    it('should work', () => {
        expect(true).toBe(true);
    });
  });
}

@Component({
  selector: 'test-cmp',
  directives: [LoginComponent],
  template: '<sd-login></sd-login>'
})
class TestComponent {}
