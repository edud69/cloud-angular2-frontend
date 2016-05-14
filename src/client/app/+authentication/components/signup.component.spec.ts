import {
  describe,
  expect,
  it
} from '@angular/testing';
import {Component} from '@angular/core';
//import {DOM} from '@angular/src/platform/dom/dom_adapter';
import {SignupComponent} from './signup.component';

export function main() {
  describe('Signup component', () => {
    it('should work', () => {
        expect(true).toBe(true);
    });
  });
}

@Component({
  selector: 'test-cmp',
  directives: [SignupComponent],
  template: '<sd-signup></sd-signup>'
})
class TestComponent {}
