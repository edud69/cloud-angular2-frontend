import {Inject} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

export class SignupConfirmationService {

  constructor(@Inject(Http) public http:Http) {}

  confirmSignup(email : string, newPassword : string, confirmationToken : string) {
    var headers : Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Tenant-id', 'master'); //TODO

    var body : string = JSON.stringify({
        tenantId : 'master', //TODO
        confirmationToken: confirmationToken
      });

    this.http.post('<%= AUTHSERVICE_API_userSubscribeConfirmation %>', body, { headers: headers })
    .subscribe(
      json => alert('Account is now active!'),
      error => alert(error),
      () => console.log('Request completed')
    );
  }
}
