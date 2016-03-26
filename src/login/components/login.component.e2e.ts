describe('Login', () => {

  beforeEach( () => {
    browser.get('');
  });

  it('should have an input', () => {
    expect(element(by.css('sd-app sd-login form input')).isPresent()).toEqual(true);
  });
});
