import { isArray } from './array';
import { snakeCase } from 'lodash';
import { camelcase } from './string';

/**
 * Check the given parameter is object or not.
 *
 * @param {any} obj
 * @returns {boolean}
 */
export function isObject(obj: any): boolean {
  return (
    obj !== undefined &&
    obj !== null &&
    !Array.isArray(obj) &&
    obj instanceof Object
  );
}

/**
 * Camelize the snake_case data. The data parameter can be an object, array of object, string, date.
 * Instance of Date is also instance of Object so need to be handled.
 *
 * @param {any} data
 * @returns {any}
 */
export function camelize(data: any): any {
  const isDate = data instanceof Date;

  if (isArray(data)) {
    return data.map((obj: any) => camelize(obj));
  }

  if (!isDate && isObject(data)) {
    return Object.keys(data).reduce((accumulator, current) => {
      const key = camelcase(current);
      const value = camelize(data[current]);

      return Object.assign(accumulator, { [key]: value });
    }, {});
  }

  return data;
}

/**
 * Get the copy of object without attributes.
 *
 * @param {any} obj
 * @param {any[]} attrsToExclude
 * @returns {T}
 */
export function withoutAttrs<T>(obj: any, attrsToExclude: any[]): T {
  if (Array.isArray(obj)) {
    // It is recommended to use listWithoutAttrs() function instead for arrays.
    throw new TypeError(
      'withoutAttrs() expects first argument to be a plain object, array given.'
    );
  }

  const result: any = {};

  Object.keys(obj).forEach((key: string) => {
    if (!attrsToExclude.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * Change object's key to snake case
 *
 * @param {any} obj
 */
export function toSnakeCase(obj: any): any {
  return Object.keys(obj).reduce((accumulator, current) => {
    const key = snakeCase(current);
    const value = obj[current];

    return Object.assign(accumulator, { [key]: value });
  }, {});
}
