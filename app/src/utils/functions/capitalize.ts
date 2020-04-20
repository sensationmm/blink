const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''

    const parts = s.split(' ');
    let final = '';

    parts.forEach((part: string, count: number) => {
        parts[count] = part.charAt(0).toUpperCase() + part.slice(1);
    });

    return parts.join(' ');
}

export default capitalize;
