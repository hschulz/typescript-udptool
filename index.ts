import { createSocket, Socket } from 'dgram'

/**
 * The callback signature specified by the `socket.send()` function from dgram.
 */
export type BroadcastCallback = (error: Error | null, bytes: number) => void

/**
 * Basic call to broadcast.
 * Since no address is given `255.255.255.255` will be used.
 *
 * @param data A string or Buffer containing the data to be sent
 * @param port A port in the range of 1 to 65535
 * @throws Error if the given port is out of range
 */
export function broadcast(
    data: Buffer | string,
    port: number
): void

/**
 * Broadcast using a callback.
 * Since no address is given `255.255.255.255` will be used.
 *
 * @param data A string or Buffer containing the data to be sent
 * @param port A port in the range of 1 to 65535
 * @param cb A callback function to check for errors or bytes sent
 * @throws Error if the given port is out of range
 */
export function broadcast(
    data: Buffer | string,
    port: number,
    cb: BroadcastCallback | undefined
): void

/**
 * Broadcasts the data using UDP and IPv4.
 *
 * @param data A string or Buffer containing the data to be sent
 * @param port A port in the range of 1 to 65535
 * @param address Some IpV4 address
 * @param cb A callback function to check for errors or bytes sent
 * @throws Error if the given port is out of range
 */
export function broadcast(
    data: Buffer | string,
    port: number,
    address: string | BroadcastCallback | undefined,
    cb: BroadcastCallback | undefined
): void

/**
 * Implementation of the actual broadcast function.
 */
export function broadcast(
    data: Buffer | string,
    port: number,
    addressOrCallback: string | BroadcastCallback | undefined = '255.255.255.255',
    cb: BroadcastCallback | undefined = undefined
): void {

    /* Use this as the typed address instead of the argument */
    let address: string = addressOrCallback as string

    /* Parse arguments */
    if (typeof addressOrCallback !== 'string') {
        cb = addressOrCallback as BroadcastCallback
        address = '255.255.255.255'
    }

    /* Check port range and throw */
    if (isPortOutOfRange(port)) {
        throw new Error('Port value is out of range. Should be in range [1-65535].')
    }

    /* Create a new socket */
    const socket: Socket = createSocket('udp4')

    /* Bind the socket with a callback */
    socket.bind(() => {

        /* Set socket to broadcast */
        socket.setBroadcast(true)

        /* Send the data */
        socket.send(data, 0, data.length, port, address, (e: Error | null, bytes: number) => {

            /* All done, close the socket */
            socket.close()

            if (cb) {
                cb(e, bytes)
            }
        })
    })
}

/**
 * Helper function to check if the port number is in a valid range.
 *
 * @param port The port number
 * @returns True if between [1-65535]
 */
function isPortOutOfRange(port: number): boolean {
    return port > 65535 || port < 1
}
