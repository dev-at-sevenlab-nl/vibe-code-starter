import https from 'https'

export function fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'node' } }, res => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => resolve(JSON.parse(data)))
        }).on('error', reject)
    })
}