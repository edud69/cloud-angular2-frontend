
/**
 * HttpUrlUtils class.
 */
export class HttpUrlUtils {

  static getUrlParameterByName(name : string) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(HttpUrlUtils._getCurrentBrowserUrl());
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

    /**
   * Combines an ID to an URL.
   * @param originalUrl the orinal URL.
   * @param id the id to be added to the URL.
   */
  static combineId(originalUrl : string, id : number) : string {
    return HttpUrlUtils.combine(originalUrl, id.toString());
  }

  /**
   * Combines a path to an URL.
   * @param originalUrl the orinal URL.
   * @param path the extra path to be added to the URL.
   */
  static combine(originalUrl : string, path : string) : string {
    if(originalUrl.endsWith('/')) {
      return originalUrl + path;
    }
    return originalUrl + '/' + path;
  }

  private static _getCurrentBrowserUrl() {
    return window.location.href;
  }

}
