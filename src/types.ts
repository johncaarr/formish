/**
 * @file types.ts
 * @description contains related types
 * @author John Carr <johncaarr@gmail.com>
 * @license MIT
 */

import type { ChangeEvent, FormEvent } from 'react'

export type FormChangeHandler = (event: ChangeEvent<any>) => void

export type FormChangeValidatorCallback<F, K extends keyof F> = (
  value: F[K]
) => [boolean, string?]

export type FormChangeValidator<F, K extends keyof F> =
  | FormChangeValidatorCallback<F, K>
  | Array<FormChangeValidatorCallback<F, K>>

export type FormErrors<F> = {
  [K in keyof Partial<F>]: string | undefined
}

export type FormSubmitHandler = (event: FormEvent<HTMLFormElement>) => void

export type FormValidationSchema<F> = {
  [K in keyof Partial<F>]: FormChangeValidator<F, K>
}

export type StateEditor<S> = <K extends keyof S>(
  key: K,
  value: S[K] | undefined
) => void

