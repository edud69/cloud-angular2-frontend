declare var fetch : any;

export class LoginService {
  names = [
    'Edsger Dijkstra',
    'Donald Knuth',
    'Alan Turing',
    'Grace Hopper'
  ];

  get(): string[] {
    return this.names;
  }
  add(value: string): void {
    this.names.push(value);
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
		'X-Tenant-id': 'master',
		'Authorization': 'Basic YWRtaW46YXNkZmFzZGY='
      }
    })
    .then((response : any) => response.json())
	.then((json : any) => {
		console.log(json);
		console.log('refresh token: ' + json.refresh_token);
		console.log('access token: ' + json.access_token);
	})
    .catch((error : any) => {
      alert(error.message);
      console.log(error.message);
    });
  }
}
