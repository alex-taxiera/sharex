import React, { useState } from 'react'
import { StyledInput, useForm } from 'styled-input'

import { classname } from '../../utils/classname'

import './index.scss'

export function ProtectedRequestForm ({
  formId,
  formClass,
  request,
  inputs,
  error,
  isLoading
}) {
  const [ formError, setFormError ] = useState(null)

  const {
    fields,
    hasErrors,
    isComplete,
    handleChange,
    handleSubmit
  } = useForm([
    ...inputs,
    {
      name: 'password',
      label: 'Admin Password',
      type: 'password',
      value: '',
      isRequired: true
    }
  ], async () => {
    if (canSubmit) {
      setFormError(null)
      request(Object.values(fields)
        .reduce((store, { name, value }) => {
          store[name] = value
          return store
        }, {}))
    } else {
      setFormError(Error('ERROR'))
    }
  })

  const canSubmit = !hasErrors && isComplete
  return (
    <form
      className={classname('protected-request', formClass)}
      disabled={!canSubmit}
      onSubmit={handleSubmit}
    >
      {
        Object.values(fields)
          .map((field, key) => (
            <StyledInput
              key={key}
              name={field.name}
              id={formId + field.name}
              label={field.label}
              type={field.type}
              isRequired={field.isRequired}
              value={field.value}
              onChange={handleChange}
              accentColor="maroon"
              wrapperStyle={{
                color: 'maroon'
              }}
              inputWrapperStyle={{
                color: '#333333',
                background: '#EEEEEE',
                boxShadow: '0 0 5px #EEEEEE'
              }}
              labelStyle={{
                color: '#DDDDDD'
              }}
            />
          ))
      }
      {
        formError
          ? (
            <div
              className="error"
            >
              {formError.message}
            </div>
          ) : null
      }
      {
        error
          ? (
            <div
              className="error"
            >
              {error.message}
            </div>
          ) : null
      }
      <button
        type="submit"
        disabled={!canSubmit || isLoading}
      >
        {
          isLoading
            ? 'Loading...'
            : 'Submit'
        }
      </button>
    </form>
  )
}
