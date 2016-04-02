import {Inject} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

export class SignupService {

  constructor(@Inject(Http) public http:Http) {}

  signup(event : Event, username : string) {
    event.preventDefault();

    var headers : Headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-Tenant-id', 'master'); //TODO

    var body : string = JSON.stringify({
        email: username,
        tenantId: 'master' //TODO
      });

    this.http.post('<%= AUTHSERVICE_API_userSubscribe %>', body, { headers: headers })
    .subscribe(
      json => alert('Check your mailbox!'),
      error => alert(error),
      () => console.log('Request completed')
    );
  }
}
