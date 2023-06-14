let resolvedWebAddress = import.meta.env.VITE_WEB_ADDRESS ? import.meta.env.VITE_WEB_ADDRESS : "";

const Config = {
    API_ADDRESS: "http://localhost:8000",
    // WEB_ADDRESS: resolvedWebAddress,
    // API_ADDRESS: resolvedWebAddress + "/api"
}

export default Config;
