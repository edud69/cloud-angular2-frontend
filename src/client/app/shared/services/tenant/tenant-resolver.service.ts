import {Injectable} from 'angular2/core';

/**
 * Tenant resolver service.
 */
@Injectable()
export class TenantResolverService {

    resolveCurrentTenant() : string {
        return 'master'; //TODO something based on url ???
    }

}
