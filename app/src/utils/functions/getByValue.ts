export const getByValue = (arr: any[], key: string, value: any) => {
    const filteredArray = arr.filter((obj) => {
        return obj[key] === value;
    });

    return filteredArray.length ? filteredArray[0] : null;
};
