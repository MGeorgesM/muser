export const formatDate = (timestampSeconds) => {
    const date = new Date(timestampSeconds * 1000);
    console.log(date);  // This should now reflect the correct date

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const messageDate = date.toISOString().slice(0, 10);

    if (today === messageDate) {
        // It's today, show only time in HH:MM format
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
        // It's not today, show date in dd/mm/yyyy format and time
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ' ' + date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}