interface IHttpConstants {
    HTTP_HEADER_ACCEPT : string;
    HTTP_HEADER_AUTHORIZATION : string;
    HTTP_HEADER_CONTENT_TYPE : string;
    HTTP_HEADER_TENANTID : string;

    HTTP_HEADER_VALUE_APPLICATIONJSON : string;
    HTTP_HEADER_VALUE_BASIC_PREFIX : string;
    HTTP_HEADER_VALUE_BEARER_PREFIX : string;

    HTTP_METHOD_POST : string;
}

export const HttpConstants : IHttpConstants = {
   HTTP_HEADER_ACCEPT : 'Accept',
   HTTP_HEADER_AUTHORIZATION : 'Authorization',
   HTTP_HEADER_CONTENT_TYPE : 'Content-Type',
   HTTP_HEADER_TENANTID : 'X-Tenant-id',

   HTTP_HEADER_VALUE_APPLICATIONJSON : 'application/json',
   HTTP_HEADER_VALUE_BASIC_PREFIX : 'Basic',
   HTTP_HEADER_VALUE_BEARER_PREFIX : 'Bearer',

   HTTP_METHOD_POST : 'POST'
};
