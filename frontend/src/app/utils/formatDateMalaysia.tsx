function formatDateMalaysia(date: Date): string {
    return date.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kuala_Lumpur',
    });
}

export default formatDateMalaysia;
