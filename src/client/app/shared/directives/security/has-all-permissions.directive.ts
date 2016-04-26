import {Directive, Input} from 'angular2/core';
import {TemplateRef, ViewContainerRef} from 'angular2/core';

import {IPermission, AuthoritiesService, PermissionConstants} from '../../index';

/**
 * Prevents usage of a dom if permission is not listed.
 */
@Directive({ selector: '[sdHasAllPermissions]' })
export class HasAllPermissionDirective {

    /**
     * Ctor.
     */
    constructor(
        private _templateRef: TemplateRef,
        private _viewContainer: ViewContainerRef,
        private _authoritiesService: AuthoritiesService
        ) { }


    @Input()
    set sdHasAllPermissions(inputPerms: string) {
        let permissions : IPermission[] = [];
        let permissionsStr : string[] = inputPerms.split(',');

        permissionsStr.forEach(permStr => {
            let permissionName : string = permStr.trim();
            let permission = (<IPermission>(<any>PermissionConstants)[permissionName]);

            if(permission) {
                permissions.push(permission);
            } else {
                throw new Error('Permission does not exists. Permission: ' + permissionName);
            }
        });

        if (this._authoritiesService.hasAllPermissions(permissions)) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        } else {
            this._viewContainer.clear();
        }
    }
}
