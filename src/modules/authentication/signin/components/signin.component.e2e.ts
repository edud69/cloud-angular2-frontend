describe('Signin', () => {

  beforeEach( () => {
    browser.get('');
  });

  it('should have an input', () => {
    expect(element(by.css('sd-app sd-signin form input')).isPresent()).toEqual(true);
  });
});
