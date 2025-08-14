export function handleApiError(err) {
    // Axios-specific error handling
    if (err.response && err.response.status) {
        const errorMessage = err.response.data?.error || err.response.data?.message;
        if (errorMessage) return errorMessage;

        return mapStatusToMessage(err.response.status);
    }

    // Fetch (or other libraries) — no .response but may contain a status property
    if (err.status) {
        return mapStatusToMessage(err.status);
    }

    // Connection issues — Axios or other libraries
    if (err.message && /Network Error/i.test(err.message)) {
        return 'Unable to connect to the server. Please try again later.';
    }

    // Fallback for unexpected errors
    return 'An unexpected error occurred.';
}

function mapStatusToMessage(status) {
    switch (status) {
        case 400:
            return 'Bad request. Please check your input.';
        case 401:
            return 'Incorrect email or password.';
        case 403:
            return 'You do not have permission to access this resource.';
        case 404:
            return 'Requested resource not found.';
        case 500:
            return 'Internal server error. Please try again later.';
        case 503:
            return 'Service unavailable. Please try again later.';
        default:
            return 'An unexpected server error occurred.';
    }
}
