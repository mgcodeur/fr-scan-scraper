const trimAndRemoveMultipleSpaces = (str) => {
    return str.trim().replace(/\s+/g, ' ');
};

export { trimAndRemoveMultipleSpaces };