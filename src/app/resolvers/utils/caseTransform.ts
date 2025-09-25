// utils/caseTransform.ts
export const snakeToCamel = (str: string): string =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

export const transformObjectKeys = <T extends Record<string, any>>(
    obj: T
): Record<string, any> => {
    if (!obj || typeof obj !== 'object') return obj

    const transformed: Record<string, any> = {}

    Object.keys(obj).forEach(key => {
        const camelKey = snakeToCamel(key)
        transformed[camelKey] = obj[key]
    })

    return transformed
}

export const transformArrayKeys = <T extends Record<string, any>>(
    arr: T[]
): Record<string, any>[] =>
    arr.map(obj => transformObjectKeys(obj))