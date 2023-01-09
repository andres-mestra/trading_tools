import { useState } from 'react'

/***
 * Retorna el valor de una caja de texto
 *  ***/
export const useForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState)

  const reset = () => {
    setValues(initialState)
  }

  const handleInputChange = ({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value,
    })
  }

  return [values, handleInputChange, reset, setValues]
}
