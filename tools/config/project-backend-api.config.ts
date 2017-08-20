export class ProjectBackendApi {

  // API PATHS
  ACCOUNTSERVICE_PROD_BASE_URL : string = 'https://region1.theshire.io/api/v1/account/';
  ACCOUNTSERVICE_DEV_BASE_URL : string = 'http://localhost:8080/api/v1/account/';
  AUTHSERVICE_PROD_BASE_URL : string = 'https://region1.theshire.io/api/v1/auth/';
  AUTHSERVICE_DEV_BASE_URL : string = 'http://localhost:8080/api/v1/auth/';
  CHATSERVICE_WS_PROD_BASE_URL : string = 'wss://region1.theshire.io/ws/chat/connect';
  CHATSERVICE_WS_DEV_BASE_URL : string = 'ws://localhost:8080/ws/chat/connect';
  DOCUMENT_PROD_BASE_URL : string = 'https://region1.theshire.io/api/v1/document/';
  DOCUMENT_DEV_BASE_URL : string = 'http://localhost:8080/api/v1/document/';

  // ACCOUNT-SERVICE PATHS
  ACCOUNTSERVICE_API_createProfile = this._accountService('');
  ACCOUNTSERVICE_API_getProfile = this._accountService('');
  ACCOUNTSERVICE_API_getProfileLite = this._accountService('lite');
  ACCOUNTSERVICE_API_updateProfile = this._accountService('');

  // AUTH-SERVICE PATHS
  AUTHSERVICE_API_facebookLogin = this._authService('signin/facebook');
  AUTHSERVICE_API_googleLogin = this._authService('signin/google');
  AUTHSERVICE_API_login = this._authService('login');
  AUTHSERVICE_API_lostPassword = this._authService('password/lost');
  AUTHSERVICE_API_refreshJwtToken = this._authService('token/refresh');
  AUTHSERVICE_API_updatePassword = this._authService('password/update');
  AUTHSERVICE_API_userSubscribe = this._authService('user/subscription');
  AUTHSERVICE_API_userSubscribeConfirmation = this._authService('user/subscription/activation');
  AUTHSERVICE_API_restorePassword = this._authService('password/restore');

  // CHAT-SERVICE PATHS
  CHATSERVICE_API_connect = this._chatServiceWS();

  // DOCUMENT-SERVICE PATHS
  DOCUMENTSERVICE_API_uploadUserAvatar : string = this._documentService('user/avatar');

  private _env : string;

  constructor(env : string) {
      this._env = env;
  }

  private _accountService(path : string) : string {
    return (this._env === 'prod' ? this.ACCOUNTSERVICE_PROD_BASE_URL : this.ACCOUNTSERVICE_DEV_BASE_URL) + path;
  }

  private _authService(path : string) : string {
    return (this._env === 'prod' ? this.AUTHSERVICE_PROD_BASE_URL : this.AUTHSERVICE_DEV_BASE_URL) + path;
  }

  private _chatServiceWS() : string {
    return (this._env === 'prod' ? this.CHATSERVICE_WS_PROD_BASE_URL : this.CHATSERVICE_WS_DEV_BASE_URL);
  }

  private _documentService(path : string) : string {
    return (this._env === 'prod' ? this.DOCUMENT_PROD_BASE_URL : this.DOCUMENT_DEV_BASE_URL) + path;
  }
}
