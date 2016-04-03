import {Inject} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

export class SignupService {

  constructor(@Inject(Http) private _http:Http) {}

  signup(username : string, password : string) {
    var headers : Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Tenant-id', 'master'); //TODO

    var body : string = JSON.stringify({
        email: username,
        password: password,
        tenantId: 'master' //TODO
      });

    this._http.post('<%= AUTHSERVICE_API_userSubscribe %>', body, { headers: headers })
    .subscribe(
      json => alert('Check your mailbox!'),
      error => alert(error),
      () => console.log('Request completed')
    );
  }
}
