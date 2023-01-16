export function dollarToCent(dollar) {
    if (dollar === undefined) return 0
    if (dollar.startsWith('.')) {
        let part = dollar.slice(1)
        if (part.length > 2) part = part.slice(0, 2)
        return parseInt(part + '0'.repeat(2 - part.length))
    }
    let parts = dollar.split('.')
    if (parts.length === 1) parts.push('')
    if (parts[1].length > 2) parts[1] = parts[1].slice(0, 2)
    return parseInt(parts[0] + parts[1] + '0'.repeat(2 - parts[1].length))
}
