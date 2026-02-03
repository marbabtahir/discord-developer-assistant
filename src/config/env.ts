/**
 * Re-export env validation for use in scripts (e.g. register-commands)
 * that may run before the main app and need the same env contract.
 */

export { config } from './index';
