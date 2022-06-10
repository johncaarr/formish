/**
 * @file validations.ts
 * @description provides simple validation helper functions
 * @author John Carr <johncaarr@gmail.com>
 * @license MIT
 */

export namespace validations {
  /**
   * Checks if input string is an email address
   * @param input string
   * @returns boolean
   */
  export const isEmail = (input: string): boolean =>
    /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(input)

  /**
   * Strips whitespace from input string then checks if it's empty
   * @param input string
   * @returns boolean
   */
  export const isEmpty = (input: string): boolean =>
    input.replace(/\s/g, '').length === 0

  /**
   * Checks if input string is a specified length
   * @param input string
   * @param minLength number
   * @param maxLength number
   * @returns boolean
   */
  export const isLength = (
    input: string,
    minLength: number,
    maxLength?: number
  ): boolean =>
    input.length >= minLength && maxLength ? input.length <= maxLength : true
}
