let resolvedWebAddress = import.meta.env.VITE_WEB_ADDRESS ? import.meta.env.VITE_WEB_ADDRESS : "";

const Config = {
    API_URL: "http://localhost:8000",
    // WEB_ADDRESS: resolvedWebAddress,
    // API_ADDRESS: resolvedWebAddress + "/api"
    MODELS: [{
        displayName: "GPT-3.5",
        name: "3.5",
    }, {
        displayName: "GPT-4",
        name: "4",
    }],
    GOOGLE_CLIENT_ID: '669509337543-6mdhlqj5i2tut0nkuthp8up6141cpcfn.apps.googleusercontent.com'
}

export default Config;
