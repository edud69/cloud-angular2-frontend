import {Injectable} from 'angular2/core';

import {IPermission, AuthTokenService} from '../../index';

/**
 * Authorities service.
 */
@Injectable()
export class AuthoritiesService {

  private static _ROLE_PREFIX : string = 'ROLE_';

  constructor(private _authTokenService : AuthTokenService) {}

  /**
   * True if user has permission.
   */
  hasPermission(permission : IPermission) : boolean {
      return this.hasAllPermissions([permission]);
  }

  /**
   * True if user has at least one of the given permissions.
   */
  hasAnyPermission(permissions : IPermission[]) : boolean {
      if(permissions.length === 0) {
          return true;
      }

      let hasAnyPerm = false;
      let userPerms = this._getPermissions();

      permissions.forEach(perm => {
          if(this._containsPermission(perm, userPerms)) {
              hasAnyPerm = true;
              return;
          }
      });

      return hasAnyPerm;
  }

  /**
   * True if user has all given permissions.
   */
  hasAllPermissions(permissions : IPermission[]) : boolean {
      if(permissions.length === 0) {
          return true;
      }

      let hasAllPerms = true;
      let userPerms = this._getPermissions();

      permissions.forEach(perm => {
          if(!this._containsPermission(perm, userPerms)) {
              hasAllPerms = false;
              return;
          }
      });

      return hasAllPerms;
  }

  /**
   * Gets the user permissions.
   */
  private _getPermissions() : IPermission[] {
      let permissions : IPermission[] = [];
      let authorities : string[] = this._authTokenService.getAuthorities();
      if(authorities) {
          authorities.forEach(aut => {
             if(!this._isRole(aut)) {
                 permissions.push({name : aut});
             }
          });
      }

      return permissions;
  }

  /**
   * Determines if authority is a role.
   */
  private _isRole(authority : string) {
      return authority.indexOf(AuthoritiesService._ROLE_PREFIX) === 0;
  }

  /**
   * Checks if a permission exists in a permission container.
   */
  private _containsPermission(permission : IPermission, permissions : IPermission []) : boolean {
      if(permissions) {
        if(permission) {
            let found = false;
            permissions.forEach(perm => {
               if(perm.name === permission.name) {
                   found = true;
                   return;
               }
            });

            if(found) {
                return true;
            }
        }
      }

      return false;
  }
}
