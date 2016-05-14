import {
  describe,
  expect,
  it
} from '@angular/testing';
import {Component} from '@angular/core';
//import {DOM} from '@angular/src/platform/dom/dom_adapter';
import {SigninComponent} from './signin.component';

export function main() {
  describe('Signin component', () => {
    it('should work', () => {
        expect(true).toBe(true);
    });
  });
}

@Component({
  selector: 'test-cmp',
  directives: [SigninComponent],
  template: '<sd-signin></sd-signin>'
})
class TestComponent {}
