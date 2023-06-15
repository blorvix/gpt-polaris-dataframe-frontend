import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const responseMessage = (response: any) => {
        console.log(response);
    };
    const errorMessage = () => {
    };
    return (
        <div>
            <br />
            <br />
            <div style={{width: "200px"}}>
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </div>
        </div>
    )
}

export default Login;
