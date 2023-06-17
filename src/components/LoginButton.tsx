import React, { useEffect, useCallback, useContext } from 'react';
import { GoogleLogin } from '@leecheuk/react-google-login';
import GoogleButton from 'react-google-button';

// const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_BASE_BACKEND_URL } = process.env;
const REACT_APP_GOOGLE_CLIENT_ID = '669509337543-6mdhlqj5i2tut0nkuthp8up6141cpcfn.apps.googleusercontent.com'
const REACT_APP_BASE_BACKEND_URL = 'http://localhost:8000'

const LoginButton = () => {
    const openGoogleLoginPage = useCallback(() => {
        const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const redirectUri = 'auth/login/google/';
    
        const scope = [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' ');
    
        const params = {
          response_type: 'code',
          client_id: REACT_APP_GOOGLE_CLIENT_ID || '',
          redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
          prompt: 'select_account',
          access_type: 'offline',
          scope
        };
    
        const urlParams = new URLSearchParams(params).toString();
    
        // window.location = `${googleAuthUrl}?${urlParams}`;
        window.location = `${googleAuthUrl}?${urlParams}` as unknown as Location;
    }, []);

    return (
        <>
            <div style={{width: "200px"}}>
                <GoogleButton
                    onClick={openGoogleLoginPage}
                    label="Sign in with Google"
                    disabled={!REACT_APP_GOOGLE_CLIENT_ID}
                />
            </div>
        </>
    )
}

export default LoginButton;
