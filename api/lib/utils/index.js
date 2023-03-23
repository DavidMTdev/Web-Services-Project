const urlRegExp = (path, url) => {
    const array2 = path.split("/").filter(row => row !== '')
    // const array = path.split(/:(\w+)/)

    let a = '^'
    if (array2.length === 0) {
        a += '\\/'
    } else {
        array2.forEach(row => {
            if (row.match(/:(\w+)/)) {
                a += `\\/(?<${row.slice(1)}>\\w+)`
            } else {
                a += `\\/${row}`
            }
        })
    }
    a += '$'

    const regexp = new RegExp(a)
    const pathname = url.pathname.match(regexp)

    return pathname
}

module.exports = {
    urlRegExp
}