import {Injectable} from '@angular/core';

/**
 * Tenant resolver service.
 */
@Injectable()
export class TenantResolverService {

    resolveCurrentTenant() : string {
        return 'master'; //TODO something based on url ???
    }

}
