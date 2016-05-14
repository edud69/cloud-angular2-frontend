import {Directive, Input} from '@angular/core';
import {TemplateRef, ViewContainerRef} from '@angular/core';

import {IPermission, AuthoritiesService, PermissionConstants} from '../../index';

/**
 * Prevents usage of a dom if permission is not listed.
 */
@Directive({ selector: '[sdHasAnyPermission]' })
export class HasAnyPermissionDirective {

    /**
     * Ctor.
     */
    constructor(
        private _templateRef: TemplateRef<any>,
        private _viewContainer: ViewContainerRef,
        private _authoritiesService: AuthoritiesService
        ) { }


    @Input()
    set sdHasAnyPermission(inputPerms: string) {
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

        if (this._authoritiesService.hasAnyPermission(permissions)) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        } else {
            this._viewContainer.clear();
        }
    }
}
