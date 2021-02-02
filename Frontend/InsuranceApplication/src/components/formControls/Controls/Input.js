import React from 'react'
import { TextField } from '@material-ui/core';

function Input({ name, label, placeholder, id, type, ...rest}, inputRef ) {

    //const { name, label, placeholder, id, type }, inputRef = props;
    return (
        <TextField
            variant="outlined"
            id={name} name={name} type={type} label={label} placeholder={placeholder}
            label={label}
            name={name}
            //value={value}
            inputRef={inputRef}
            type={type}
            margin="normal" required fullWidth
        />
        
    )
    
}
const forwardedInput = React.forwardRef(Input)
export default Input