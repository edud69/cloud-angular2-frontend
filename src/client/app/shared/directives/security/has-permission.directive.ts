import { Directive, Input, OnDestroy } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthoritiesService, AuthStateService } from '../../index';

/**
 * Prevents usage of a dom if permission is not listed.
 */
@Directive({ selector: '[sdHasPermission]' })
export class HasPermissionDirective implements OnDestroy {

    private _sub : any;

    private _permission : string;

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
    set sdHasPermission(permission: string) {
        this._permission = permission;
        this._validate();
    }

    ngOnDestroy() {
        let sub = this._sub;
        if(sub) {
            sub.unsubscribe();
        }
    }

    private _validate() {
        if (this._authoritiesService.hasPermission({name : this._permission})) {
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
