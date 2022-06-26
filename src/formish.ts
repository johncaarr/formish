/**
 * @file formish.ts
 * @description contains form state management hooks
 * @author John Carr <johncaarr@gmail.com>
 * @license MIT
 */

import { useMemo, useState } from 'react'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'
import type {
  FormChangeHandler,
  FormErrors,
  FormSubmitHandler,
  FormValidationSchema,
  StateEditor,
} from './types'

/**
 * State management wrapper meant for objects
 * `editState` is used to edit individual object props
 */
export const useStateEditor = <S>(
  initialState: (() => S) | S
): [S, StateEditor<S>, Dispatch<SetStateAction<S>>] => {
  const [state, setState] = useState<S>(initialState)
  const editState: StateEditor<S> = (key, value) =>
    setState({ ...state, [key]: value })
  return [state, editState, setState]
}

/**
 * Returns modified key/value pair for component ChangeEvents
 */
const changeEventKeyValue = (event: ChangeEvent<any>): [any, any] => {
  const key = event.target.name
  switch (event.target.type) {
    case 'checkbox':
    case 'radio':
      return [key, event.target.checked]
    default:
      return [key, event.target.value]
  }
}

/**
 * Formik-esque state management
 */
export const useFormState = <F>(params: {
  initialValues: F
  validationSchema?: FormValidationSchema<F>
  onSubmit: (values: F) => void | Promise<void>
  onFailure?: (errors: FormErrors<F>) => void | Promise<void>
}): [F, FormErrors<F>, FormChangeHandler, FormSubmitHandler] => {
  const { initialValues, validationSchema, onSubmit, onFailure } = params
  const [values, editValue] = useStateEditor<F>(initialValues)
  const [errors, editError] = useStateEditor<FormErrors<F>>({} as FormErrors<F>)

  /**
   * Handles changes within the form state
   */
  const handleChange: FormChangeHandler = useMemo<FormChangeHandler>(() => {
    return (event) => {
      event.preventDefault()
      const [key, value] = changeEventKeyValue(event)
      if (validationSchema && key in validationSchema) {
        const validate = validationSchema[key as keyof typeof validationSchema]
        const [isValid, error] = validate(value)
        setTimeout(() => editError(key, isValid ? undefined : error!), 0)
      }
      editValue(key, value)
    }
  }, [validationSchema])

  /**
   * Performs form validation
   * & handles form submission
   */
  const handleSubmit: FormSubmitHandler = useMemo<FormSubmitHandler>(() => {
    return (event) => {
      event.preventDefault()
      const numErrors = Object.values(errors).reduce<number>((t, err) => {
        return err !== undefined ? t + 1 : t
      }, 0)
      if (numErrors === 0) onSubmit(values)
      else if (onFailure !== undefined) onFailure(errors)
      else console.error('formish: failed to submit form', errors)
    }
  }, [errors])

  return [values, errors, handleChange, handleSubmit]
}
