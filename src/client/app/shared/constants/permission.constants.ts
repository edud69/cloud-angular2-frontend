export interface IPermission { name : string; }

export class PermissionConstants {
    static ACCOUNT_READ : IPermission = {name: 'ACCOUNT_READ'};
    static CHAT_SEND : IPermission = {name: 'CHAT_SEND'};
    static DOCUMENT_TEMPLATE_READ : IPermission = {name: 'DOCUMENT_TEMPLATE_READ'};
    static INDEX_ALL : IPermission = {name: 'INDEX_ALL'};
    static INDEX_ALL_OF_SPECIFIC_TYPE : IPermission = {name: 'INDEX_ALL_OF_SPECIFIC_TYPE'};
    static SEND_EMAIL : IPermission = {name: 'SEND_EMAIL'};
    static USER_AVATAR_UPLOAD : IPermission = {name: 'USER_AVATAR_UPLOAD'};
}

