import { useState } from 'react'

const useHandleOnChangeTextInput = (fields) => {
    const [inputState, setInputState] = useState(fields)

    const handleInputChange = (value, name) => {
        setInputState({
            ...inputState,
            [name]: value,
        })
    }

    const clearFields = () => {
        setInputState(fields);
    }

    return [inputState, handleInputChange, clearFields]
}

export default useHandleOnChangeTextInput
