const removeUndefined = (obj: object) => {
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
    return obj;
};

module.exports = removeUndefined;