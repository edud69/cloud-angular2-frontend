describe('App', () => {

  beforeEach( () => {
      browser.get('');
  });

  it('should have a title', () => {
      expect(browser.getTitle()).toEqual('My Angular2 App');
  });

  it('should have <nav>', () => {
      expect(element(by.css('sd-app sd-navbar nav')).isPresent()).toEqual(true);
  });

  it('should have correct nav text for Home', () => {
      expect(element(by.css('sd-app sd-navbar nav a:first-child')).getText()).toEqual('HOME');
  });

  it('should have correct nav text for Login', () => {
      expect(element(by.css('sd-app sd-navbar nav a:nth-child(2)')).getText()).toEqual('LOGIN');
  });

  it('should have correct nav text for Register', () => {
      expect(element(by.css('sd-app sd-navbar nav a:nth-child(3)')).getText()).toEqual('REGISTER');
  });

  it('should have correct nav text for About', () => {
      expect(element(by.css('sd-app sd-navbar nav a:last-child')).getText()).toEqual('ABOUT');
  });

});
