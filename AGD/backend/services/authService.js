import axios from "axios";

// Funzione per ottenere un nuovo accessToken
export const refreshAccessToken = async () => {
    try {
        const res = await axios.post("http://localhost:5000/auth/refresh", {}, { withCredentials: true });
        sessionStorage.setItem("accessToken", res.data.accessToken);
        return res.data.accessToken;
    } catch (error) {
        console.error("Sessione scaduta, fai il login di nuovo");
        return null;
    }
};

// Istanza di Axios con intercettori per il token
export const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        let token = sessionStorage.getItem("accessToken");

        if (!token) {
            token = await refreshAccessToken();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);