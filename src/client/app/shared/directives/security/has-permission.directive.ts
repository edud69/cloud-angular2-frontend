import {Directive, Input} from 'angular2/core';
import {TemplateRef, ViewContainerRef} from 'angular2/core';

import {AuthoritiesService} from '../../index';

/**
 * Prevents usage of a dom if permission is not listed.
 */
@Directive({ selector: '[sdHasPermission]' })
export class HasPermissionDirective {

    /**
     * Ctor.
     */
    constructor(
        private _templateRef: TemplateRef,
        private _viewContainer: ViewContainerRef,
        private _authoritiesService: AuthoritiesService
        ) { }


    @Input()
    set sdHasPermission(permission: string) {
        if (this._authoritiesService.hasPermission({name : permission})) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        } else {
            this._viewContainer.clear();
        }
    }
}
