# Udp Tool

Used to broadcast IPv4 UDP data.

[travis-img]: https://img.shields.io/travis/com/hschulz/typescript-udptool?style=flat-square
[codecov-img]: https://img.shields.io/codecov/c/github/hschulz/typescript-udptool.svg?style=flat-square
[github-issues-img]: https://img.shields.io/github/issues/hschulz/typescript-udptool.svg?style=flat-square
[contrib-welcome-img]: https://img.shields.io/badge/contributions-welcome-blue.svg?style=flat-square
[license-img]: https://img.shields.io/github/license/hschulz/typescript-udptool.svg?style=flat-square

[![travis-img]](https://travis-ci.com/github/hschulz/typescript-udptool)
[![codecov-img]](https://codecov.io/gh/hschulz/typescript-udptool)
[![github-issues-img]](https://github.com/hschulz/typescript-udptool/issues)
[![contrib-welcome-img]](https://github.com/hschulz/typescript-udptool/blob/master/CONTRIBUTING.md)
[![license-img]](https://github.com/hschulz/typescript-udptool/blob/master/LICENSE)

---

## Usage

A small example code snippet showing possible use cases.

```typescript
import { broadcast } from '@haukeschulz/typescript-udptool'

/* Use a Buffer or just the plain string */
const data: Buffer = Buffer.from('This is my message')

/* Will broadcast the data to 255.255.255.255:65432 */
broadcast(data, 65432)

/* Use another address */
broadcast(data, 65432, '127.0.0.1')

/* Example of a callback function used for the broadcast */
const myCallbackHandler = (error: Error | null, bytes: number): void => {

    /* Error is hopefully null */
    if (error) {
        console.error(error.message)
    }

    /* The number of bytes sent should equal the buffer length in this case */
    console.log('Sent ' + bytes + '/' + data.length + ' bytes')
}

/*
 * Broadcast to 255.255.255.255:65432 and provide possible errors and
 * the bytes sent to the callback function.
 */
broadcast(data, 65432, myCallbackHandler)

/* Finally use the broadcast with all possible parameters */
broadcast(data, 65432, '10.11.12.13', myCallbackHandler)
```
