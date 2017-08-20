import { BaseModelTestUtils } from '../../../testing/index';

import { Gender, Profile } from '../index';

export function main() {
  describe('Profile Model', () => {

    let classUnderTest : Profile;

    let expectedUserId : number;
    let expectedFirstname : string;
    let expectedLastname : string;
    let expectedGender : Gender;
    let expectedBirthday : Date;
    let expectedAvatarUrl : string;

    beforeEach(() => {
      BaseModelTestUtils.injectMatchers();
      expectedUserId = 1234;
      expectedFirstname = 'Bob';
      expectedLastname = 'Inette';
      expectedGender = Gender.FEMALE;
      expectedBirthday = new Date();
      expectedAvatarUrl = 'http://img.myhost.com/profile/12iaA8.jpg';
      classUnderTest = new Profile(expectedUserId, expectedFirstname, expectedLastname, expectedGender,
                                   expectedBirthday, expectedAvatarUrl);
    });

    it('should match the userId', () => {
        expect(classUnderTest.userId).toEqual(expectedUserId);
    });

    it('should match the firstName', () => {
        expect(classUnderTest.firstName).toEqual(expectedFirstname);
    });

    it('should match the lastName', () => {
        expect(classUnderTest.lastName).toEqual(expectedLastname);
    });

    it('should match the gender', () => {
        expect(classUnderTest.gender).toEqual(expectedGender);
    });

    it('should match the birthday', () => {
        expect(classUnderTest.birthday).toEqual(expectedBirthday);
    });

    it('should match the avatarUrl', () => {
        expect(classUnderTest.avatarUrl).toEqual(expectedAvatarUrl);
    });

    it('should be registered in the BaseModel registry', () => {
        BaseModelTestUtils.wrapExpect({bindingClassName: 'FullAccountInfoMsg', targetClass: Profile}).toBeRegistered();
    });
  });
}
