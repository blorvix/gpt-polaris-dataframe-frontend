import React, { useEffect, useCallback, useContext } from 'react';
import GoogleButton from 'react-google-button';
import { notifyError } from '../../services/notifications';
import { validateTokenAndCreateUser } from '../../services/requests';
import Config from '../../config';
import { UserContext, UserContextType } from '../../services/context';
import { GoogleLogin } from '@react-oauth/google';


// const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_BASE_BACKEND_URL } = process.env;

const LoginButton = (props: {afterLogin: any}) => {
    const {setToken, setUser} = useContext(UserContext) as UserContextType
    // const openGoogleLoginPage = useCallback(() => {
    //     const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    //     const redirectUri = 'auth/login/google/';

    //     const scope = [
    //       'https://www.googleapis.com/auth/userinfo.email',
    //       'https://www.googleapis.com/auth/userinfo.profile'
    //     ].join(' ');

    //     const params = {
    //       response_type: 'code',
    //       client_id: REACT_APP_GOOGLE_CLIENT_ID || '',
    //       redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
    //       prompt: 'select_account',
    //       access_type: 'offline',
    //       scope
    //     };

    //     const urlParams = new URLSearchParams(params).toString();

    //     // window.location = `${googleAuthUrl}?${urlParams}`;
    //     window.location = `${googleAuthUrl}?${urlParams}` as unknown as Location;
    // }, []);

    // const onGoogleLoginSuccess = (response: any) => {
    //     const idToken = response.tokenId;
    //     const data = {
    //         email: response.profileObj.email,
    //         first_name: response.profileObj.givenName,
    //         last_name: response.profileObj.familyName
    //     };

    //     validateTokenAndCreateUser({ data, idToken })
    //         .then((data) => {
    //             setLogined(true);
    //             setUser(data)
    //         })
    //         .catch(notifyError);
    // };

    const onGoogleLoginSuccess = (response: any) => {
        validateTokenAndCreateUser(response.credential)
            .then((data) => {
                setToken(data.token)
                setUser(data.user)
                props.afterLogin()
            })
            .catch(notifyError);
    };

    return (
        <>
            <div style={{ width: "250px" }}>
                {/* <GoogleLogin
                    render={renderProps => <GoogleButton {...renderProps} />}
                    clientId={Config.GOOGLE_CLIENT_ID}
                    buttonText="Sign in with Google"
                    onSuccess={onGoogleLoginSuccess}
                    // onFailure={({ details }) => notifyError(details)}
                    onFailure={(resp) => console.log(resp)}
                /> */}
                {/* <GoogleButton
                    onClick={openGoogleLoginPage}
                    label="Sign in with Google"
                    disabled={!REACT_APP_GOOGLE_CLIENT_ID}
                /> */}
                <GoogleLogin
                    onSuccess={onGoogleLoginSuccess}
                    onError={() => {
                        console.log('login failed');
                    }}
                    size='large'
                    width='250'
                    theme='filled_blue'
                />
            </div>
        </>
    )
}

export default LoginButton;
