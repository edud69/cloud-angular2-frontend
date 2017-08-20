import { BaseModelTestUtils } from '../../../../testing/index';

import { ProfileLite } from './profile-lite.model';

export function main() {

  describe('ProfileLite Model', () => {

    let classUnderTest : ProfileLite;
    let expectedFirstname = 'firstname';
    let expectedLastName = 'lastname';
    let expectedAvatarUrl = 'anUrl';
    let expectedUserId = 123;

    beforeEach(() => {
        BaseModelTestUtils.injectMatchers();
        classUnderTest = new ProfileLite(expectedFirstname, expectedLastName, expectedAvatarUrl, expectedUserId);
    });

    it('should match the userId', () => {
        expect(classUnderTest.userId).toBe(expectedUserId);
    });

    it('should match the firstname', () => {
        expect(classUnderTest.firstName).toBe(expectedFirstname);
    });

    it('should match the lastname', () => {
        expect(classUnderTest.lastName).toBe(expectedLastName);
    });

    it('should match the avatarUrl', () => {
        expect(classUnderTest.avatarUrl).toBe(expectedAvatarUrl);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'AccountInfoLiteMsg', targetClass: ProfileLite}).toBeRegistered();
    });
  });
}
