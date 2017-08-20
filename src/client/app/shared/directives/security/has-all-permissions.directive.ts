import { Directive, Input, OnDestroy } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';

import { IPermission, AuthoritiesService, PermissionConstants, AuthStateService } from '../../index';

/**
 * Prevents usage of a dom if permission is not listed.
 */
@Directive({ selector: '[sdHasAllPermissions]' })
export class HasAllPermissionDirective implements OnDestroy {

    private _inputPerms : string;

    private _sub : any;

    private _isVisible : boolean = false;

    /**
     * Ctor.
     */
    constructor(
        private _templateRef: TemplateRef<any>,
        private _viewContainer: ViewContainerRef,
        private _authoritiesService: AuthoritiesService,
        private _authStateService: AuthStateService
        ) {
            this._sub = this._authStateService.subscribe(state => this._validate());
        }


    @Input()
    set sdHasAllPermissions(inputPerms: string) {
        this._inputPerms = inputPerms;
        this._validate();
    }

    ngOnDestroy() {
        let sub = this._sub;
        if(sub) {
            sub.unsubscribe();
        }
    }

    private _validate() {
        let permissions : IPermission[] = [];
        let permissionsStr : string[] = this._inputPerms.split(',');

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
            if(!this._isVisible) {
                this._viewContainer.createEmbeddedView(this._templateRef);
                this._isVisible = true;
            }
        } else {
            this._viewContainer.clear();
            this._isVisible = false;
        }
    }
}
