describe('Signup Confirmation', () => {

  beforeEach( () => {
    browser.get('');
  });

  it('should have an input', () => {
    expect(element(by.css('sd-app sd-signup-confirm form input')).isPresent()).toEqual(true);
  });
});
