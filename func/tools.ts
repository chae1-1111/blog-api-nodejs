const tool = {
    removeUndefined: (obj: object) => {
        Object.keys(obj).forEach(
            (key) =>
                obj[key as keyof typeof obj] === undefined &&
                delete obj[key as keyof typeof obj]
        );
        return obj;
    },
};
module.exports = tool;
