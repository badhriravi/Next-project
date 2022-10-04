import React, { useState } from 'react';
import {emailValidator, passwordValidator} from '../component/regexValidator.jsx';

const Login = () => {

const [input, setInput] = React.useState({email:'', password:''})

const [errorMessage, seterrorMessage] = React.useState('')
const [successMessage, setsuccessMessage] = React.useState('')
const handleChange = (e) =>{
    setInput({...input,[e.target.name]: e.target.value})
}

const formSubmitter = (e) =>{
    e.preventDefault()
    setsuccessMessage('');
    seterrorMessage('');
    if(!emailValidator(input.email)) 
      return seterrorMessage('Please enter valid email id');

     if(!passwordValidator(input.password)) 
      return seterrorMessage('Password should have minimum 8 characters with combination of uppercase,lowercase,numbers and specialCharacters');
    setsuccessMessage('successfully validated')
}


    return ( 
    <center>
        <h1>Forget Password</h1>
    <form className='form' onSubmit={formSubmitter}>
{errorMessage.length > 0 && (
<div style={{marginBottom:"10px", color:'red'}}>
    {errorMessage}</div>)}
    {successMessage.length > 0 && (
<div style={{marginBottom:"10px", color:'green'}}>
    {successMessage}</div>)}           
        <label>Email:</label><br></br>
        <input type="Name" name="email"  onChange={handleChange}/><br></br>
        <label>Password:</label><br></br>
        <input type="password" name="password"  onChange={handleChange}/><br></br>
        <label>Confirm Password:</label><br></br>
        <input type="password" name="password"  onChange={handleChange}/><br></br><br></br>
        <input type="submit" value="Reset Password" /><br></br>
        
    </form>
    </center>
     );
}
 
export default Login;