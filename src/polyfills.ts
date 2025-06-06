// src/polyfills.ts

/***************************************************************************************************
 * BROWSER POLYFILLS
 */

/** Si tu aplicación debe correr en navegadores muy antiguos, aquí incluirías:
 *  import 'core-js/es/array';
 *  import 'core-js/es/promise';
 *  …etc.
 **/

/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import 'zone.js';  // Incluye zone.js para Angular

/***************************************************************************************************
 * CUSTOM POLYFILLS PARA ENTORNOS NO-BROWSER (SSR / TESTS)
 */
// Evitar que D3-brush rompa con "navigator is not defined"
if (typeof navigator === 'undefined') {
  (global as any).navigator = { maxTouchPoints: 0, userAgent: 'node.js' };
}
