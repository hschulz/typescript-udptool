import { expect } from 'chai'
import { createSocket } from 'dgram'
import { broadcast } from '../dist'

describe('UDP Tool', () => {

    describe('broadcast()', () => {

        it('should send data correctly', (done: Mocha.Done) => {

            /* Prepare test data */
            const data: Buffer = Buffer.from('UNIT TEST')

            /* Prepare test listener socket */
            const listener = createSocket('udp4')

            /* Listener should receive the udp broadcast */
            listener.on('message', (message: Buffer) => {

                /* Received data is not sent data */
                if (!message.equals(data)) {
                    done(new Error('Did not receive the correct UDP data'))
                }

                /* All good, close listener socket and quit */
                listener.close()
                done()
            })

            /* Bind listener to broadcast port */
            listener.bind(65432)

            /* Broadcast data to port */
            broadcast(data, 65432)
        })

        it('should send data and run the callback', (done: Mocha.Done) => {

            /* Prepare test data */
            const data: Buffer = Buffer.from('UNIT TEST 2')

            /* Define a custom callback */
            const myCallback = (error: Error | null, bytes: number): void => {

                /* Fail on unexpected error */
                if (error) {
                    done(error)
                }

                /* Expect the message length to equal the data length */
                expect(bytes).to.equal(data.length)

                /* Success */
                done()
            }

            /* Broadcast data to port */
            broadcast(data, 65432, myCallback)
        })

        it('should accept all parameters', (done: Mocha.Done) => {

            /* Prepare test data */
            const data: Buffer = Buffer.from('UNIT TEST 3')

            /* Define a custom callback */
            const myCallback = (error: Error | null, bytes: number): void => {

                /* Fail on unexpected error */
                if (error) {
                    done(error)
                }

                /* Expect the message length to equal the data length */
                expect(bytes).to.equal(data.length)

                /* Success */
                done()
            }

            /* Broadcast to local loopback this time */
            broadcast(data, 65432, '127.0.0.1', myCallback)
        })

        it('should throw when given an invalid port', (done: Mocha.Done) => {
            try {
                /* Use invalid port to broadcast */
                broadcast('test', 65536)
            } catch (error) {
                /* Expect this */
                if ((error as Error).message === 'Port value is out of range. Should be in range [1-65535].') {
                    return done() // cancel further execution
                }

                /* In case of any other error this test fails */
                done(error)
            }
        })
    })
})
