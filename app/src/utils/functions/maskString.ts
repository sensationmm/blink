const maskString = (value: string, charsToShow: number) => {

    const last = value.substring(value.length - charsToShow);
    const mask = value.substring(0, value.length - charsToShow).replace(/\d/g, "*");
    return mask + last;
}

export default maskString;
