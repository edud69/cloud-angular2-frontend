interface IJwtConstants {
   JWT_REFRESH_URL_PARAM : string;
   JWT_STORE_ACCESSTOKEN_KEY : string;
   JWT_STORE_REFRESHTOKEN_KEY : string;
}

export const JwtConstants : IJwtConstants = {
   JWT_REFRESH_URL_PARAM : 'refresh_token',
   JWT_STORE_ACCESSTOKEN_KEY : 'jwt_access_token',
   JWT_STORE_REFRESHTOKEN_KEY : 'jwt_refresh_token'
};
