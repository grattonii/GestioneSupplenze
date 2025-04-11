// api.js
export const fetchWithRefresh = async (url, options = {}) => {
    const token = sessionStorage.getItem("accessToken");
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    try {
        const res = await fetch(url, { ...options, headers, credentials: "include" });

        if (res.status === 403) {
            // Token scaduto: tenta refresh
            const refreshRes = await fetch("http://localhost:5000/auth/refresh", {
                method: "POST",
                credentials: "include",
            });

            const refreshData = await refreshRes.json();

            if (refreshData.accessToken) {
                // Salva nuovo token e riprova la richiesta
                sessionStorage.setItem("accessToken", refreshData.accessToken);
                headers.Authorization = `Bearer ${refreshData.accessToken}`;
                return fetch(url, { ...options, headers, credentials: "include" });
            } else {
                // Fallito anche il refresh
                throw new Error("Sessione scaduta");
            }
        }

        return res;
    } catch (error) {
        throw error;
    }
};  