import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileComponent, ProfileService } from './index';

@NgModule({
    imports: [ProfileRoutingModule, SharedModule],
    declarations: [ProfileComponent],
    exports: [ProfileComponent],
    providers: [ProfileService]
})

export class ProfileModule { }
