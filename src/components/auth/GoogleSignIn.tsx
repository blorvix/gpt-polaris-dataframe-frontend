import { notifyError } from "#/services/notifications"
import { useEffect, useState, useContext } from "react"
import { Button } from "@mui/material"
import { validateTokenAndCreateUser } from "#/services/requests"
import { UserContext, UserContextType } from "#/services/context"

const GoogleSignin = () => {
    const {setToken, setUser} = useContext(UserContext) as UserContextType
    const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false)

    const GOOGLE_CLIENT_ID = '669509337543-6mdhlqj5i2tut0nkuthp8up6141cpcfn.apps.googleusercontent.com'

    const handleGoogleSignIn = (res: any) => {
        if (!res.clientId || !res.credential) return

        validateTokenAndCreateUser(res.credential)
            .then((data) => {
                setToken(data.token)
                setUser(data.user)
            })
            .catch(notifyError);
    }
    
    useEffect(() => {
        if (gsiScriptLoaded) return


        const initializeGsi = () => {
            // Typescript will complain about window.google
            // Add types to your `react-app-env.d.ts` or //@ts-ignore it.
            // @ts-ignore
            if (!window.google || gsiScriptLoaded) return

            setGsiScriptLoaded(true)
            // @ts-ignore
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleSignIn,
            })
        }

        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.onload = initializeGsi
        script.async = true
        script.id = "google-client-script"
        document.querySelector("body")?.appendChild(script)

        return () => {
            // Cleanup function that runs when component unmounts
            // @ts-ignore
            window.google?.accounts.id.cancel()
            document.getElementById("google-client-script")?.remove()
        }
    }, [handleGoogleSignIn])

    return <Button className={"g_id_signin"} />
}

export default GoogleSignin;
