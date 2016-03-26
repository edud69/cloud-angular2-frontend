//import {Inject} from 'angular2/core';
//import {AuthHttp} from 'angular2-jwt/angular2-jwt';

declare var fetch : any;

export class LoginService {

  //constructor(@Inject(AuthHttp) public authHttp: AuthHttp) {}

  refreshAccessToken() {
    var parameters : string = '?refresh_token=' + localStorage.getItem('jwt_refresh_token');

    fetch('<%= AUTHSERVICE_API_refreshJwtToken %>' + parameters, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Tenant-id': 'master' //TODO use the given tenant
      }
    })
    .then((response : any) => response.json())
    .then((json : any) => {
      this.updateJwt(json);
    })
    .catch((error : any) => {
      alert(error.message);
      console.log(error.message);
    });

  //  this.authHttp.post('<%= AUTHSERVICE_API_refreshJwtToken %>' + parameters, '')
  //    .subscribe(
  //      (data : any) => this.updateJwt(JSON.parse(data._body)),
  //      (err : any) => console.log(err),
  //      () => console.log('Refresh completed')
  //    );
  }

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
      this.updateJwt(json);
    })
    .catch((error : any) => {
      alert(error.message);
      console.log(error.message);
    });
  }

  private updateJwt(json : any) {
    alert(JSON.stringify(json));
    sessionStorage.setItem('jwt_access_token', json.access_token);
    localStorage.setItem('jwt_refresh_token', json.refresh_token);
  }
}
