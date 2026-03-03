import axios from 'axios';

/**
 * Creates a centralized HTTP client instance.
 * @param {Object} options Options like baseURL, timeout, headers
 * @returns {import('axios').AxiosInstance}
 */
export function createHttpClient(options = {}) {
    const client = axios.create({
        timeout: 15000,
        headers: {
            'User-Agent': 'turkiyem-cli/1.0',
            'Accept': 'application/json',
            ...options.headers
        },
        maxRedirects: 5,
        ...options
    });

    client.interceptors.response.use(
        (response) => {
            // Throw API level errors (e.g., AFAD HTTP 500 but body 400)
            if (response.status >= 500) {
                throw new Error(`Sunucu Hatası (HTTP ${response.status})`);
            }
            return response;
        },
        (error) => {
            if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
                throw new Error('İstek zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
            }
            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
                throw new Error('Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
            }
            const status = error.response ? error.response.status : null;
            if (status) {
                throw new Error(`API Hatası (HTTP ${status}): ${error.message}`);
            }
            throw error;
        }
    );

    return client;
}

// A generic instance for simple GET requests
export const defaultClient = createHttpClient();
