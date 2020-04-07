const hasValue = (base: { [key: string]: any }, key: string = 'value') => {
    let value;
    if (base) {
        value = base[key];
    }

    if (
        value
        && (
            (value.value !== null && value.value !== undefined) ||
            (
                value !== null &&
                value !== undefined &&
                (typeof value === 'string' && value.substring(0, 5) !== 'Notif')
            )
        )) {
        return true;
    }

    return false
};

export default hasValue;
