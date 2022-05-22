// undefined인 항목들 제거하여 리턴
export const removeUndefined: Function = (obj: object) => {
    Object.keys(obj).forEach(
        (key) =>
            obj[key as keyof typeof obj] === undefined &&
            delete obj[key as keyof typeof obj]
    );
    return obj;
};
