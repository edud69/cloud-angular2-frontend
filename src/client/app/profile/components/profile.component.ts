import { Component} from '@angular/core';

import { ManagedComponent, IFileUploadResultsSubscriber, LoggerService } from '../../shared/index';

import { ProfileService, ProfileForm, Profile } from '../index';

@Component({
  moduleId: module.id,
  selector: 'sd-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent extends ManagedComponent<ProfileForm> {

  avatarUploadEndpoint : string = '<%= BACKEND_API.DOCUMENTSERVICE_API_uploadUserAvatar %>';

  avatarUploadCallback : IFileUploadResultsSubscriber = {
    onFileError: (filename : string) => this._loggerService.error('Failed to upload file: {0}.', [filename]),
    onFileUploaded: (filename : string, destination : string) => this.form.avatarUrl = destination,
    onUploadCompleted: () => {/* Nothing */},
    onUploadStarted: () => {/* Nothing */}
  };

  constructor(private _profileService : ProfileService, private _loggerService : LoggerService) {
    super(new ProfileForm(null, null, null, null, null));
    this._invokeAsyncService(() => this._profileService.getProfile()).then(
        profile => this._fillForm(profile),
        error => this.error = error,
        () => {/*nothing*/});
  }

  submit() {
    this._invokeAsyncService(() => this._profileService.updateProfile(this.form)).then(
        profile => this._fillForm(profile),
        error => this.error = error,
        () => {/*nothing*/});
  }

  private _fillForm(profile : Profile) {
    this.form.resetForm({firstName: profile.firstName, lastName: profile.lastName, gender: profile.gender,
                         birthday: profile.birthday, avatarUrl: profile.avatarUrl});
  }

}
