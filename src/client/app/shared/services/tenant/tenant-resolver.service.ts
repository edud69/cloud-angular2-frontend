/**
 * Tenant resolver service.
 */
export class TenantResolverService {

    resolveCurrentTenant() : string {
        return 'master'; //TODO something based on url ???
    }

}