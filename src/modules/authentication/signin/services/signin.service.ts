import {Inject} from 'angular2/core';
//import {AuthHttp} from 'angular2-jwt/angular2-jwt';

import {AuthTokenService} from '../../../../shared/services/auth-token.service';

declare var fetch : any;

export class SigninService {

  //constructor(@Inject(AuthHttp) public authHttp: AuthHttp) {}

  constructor(@Inject(AuthTokenService) public authTokenService: AuthTokenService) {}

  login(event : Event, username : string, password : string) {
    // This will be called when the user clicks on the Login button
    event.preventDefault();

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
    .then((json : any) => {
      this.authTokenService.updateToken(json);
    })
    .catch((error : any) => {
      alert(error.message);
      console.log(error.message);
    });
  }

}
