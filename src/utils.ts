const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
};

const getRandomInt: (min: number, max: number) => number = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export { capitalize, getRandomInt };