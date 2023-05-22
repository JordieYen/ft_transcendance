function getCookiesFromHeader(cookieHeader: string): Record<string, string> {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
    const cookieData = cookies.reduce((data, cookie) => {
        const [key, value] = cookie.split('=');
        data[key] = value;
        return (data);
    }, {});
    return cookieData;
}
