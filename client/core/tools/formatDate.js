export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const messageDate = date.toISOString().slice(0, 10);

    if (today === messageDate) {
        // It's today, show only time in HH:MM format
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
        // It's not today, show date in dd/mm/yy format and time
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) + 
               ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
};