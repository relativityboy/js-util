export const cssNames = (...args) => {
    const cNames = [...args]

    cNames.toString = () => cNames.join(' ')
    return cNames
}