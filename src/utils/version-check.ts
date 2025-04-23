import { red, yellow } from 'kolorist'

/**
 * Checks if the current Node.js version meets the minimum required version
 * @param minVersion Minimum required Node.js version
 * @returns True if Node.js version is sufficient, false otherwise
 */
export function checkNodeVersion(minVersion: number): boolean {
    const currentVersion = process.versions.node
    const majorVersion = parseInt(currentVersion.split('.')[0], 10)
    
    if (majorVersion < minVersion) {
        console.error(red(`Error: Node.js version ${currentVersion} is not supported`))
        console.error(yellow(`This tool requires Node.js version ${minVersion} or higher`))
        console.error(yellow(`Please upgrade your Node.js version and try again`))
        return false
    }
    
    return true
} 