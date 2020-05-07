const getValue = (base: { [key: string]: any }, key: string = 'value') => {
    let value;
    if (base) {
        value = base[key];
    }

    // @TODO- Hacky boolean value check
    if (value === 'true' || value === 'True') {
        value = true;
    } else if (value === 'false' || value === 'False') {
        value = false;
    }

    return value;
};

export default getValue;
