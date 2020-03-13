const getValue = (base: { [key: string]: any }, key: string = 'value') => {
    if (base) {
        return base[key];
    }
};

export default getValue;
