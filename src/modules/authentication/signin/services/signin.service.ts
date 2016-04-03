import {Inject} from 'angular2/core';

import {AuthTokenService} from '../../../../shared/services/auth-token.service';

declare var fetch : any;

export class SigninService {

  constructor(@Inject(AuthTokenService) private _authTokenService: AuthTokenService) {}

  login(username : string, password : string) {
    // We call our API to log the user in. The username and password are entered by the user
    fetch('<%= AUTHSERVICE_API_login %>', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Tenant-id': 'master', //TODO use the given tenant
        'Authorization': 'Basic YWRtaW46YXNkZmFzZGY=' //TODO create a Basic Auth value from username/password
      }
    })
    .then((response : any) => response.json())
    .then((json : any) => this._authTokenService.updateToken(json))
    .catch((error : any) => {
      alert(error.message);
      console.log(error.message);
    });
  }

}
