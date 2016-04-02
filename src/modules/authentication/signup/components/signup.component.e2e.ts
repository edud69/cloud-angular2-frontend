describe('Signup', () => {

  beforeEach( () => {
    browser.get('');
  });

  it('should have an input', () => {
    expect(element(by.css('sd-app sd-signup form input')).isPresent()).toEqual(true);
  });
});
