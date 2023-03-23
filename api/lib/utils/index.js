const urlRegExp = (path, url) => {
    const array = path.split(/:(\w+)/)

    let a = '^'
    array.forEach(row => {
        if (row === '/') {
            a += '\\/'
        } else if (row === '') {
            a += ''
        } else {
            a += `(?<${row}>\\w+)`
        }
    })
    a += '$'

    const regexp = new RegExp(a)
    const pathname = url.pathname.match(regexp)

    return pathname
}

module.exports = {
    urlRegExp
}