import type Echo from 'laravel-echo'

export {}

declare global {
    interface Window {
        Pusher: any
        // Echo<T> вимагає аргумент — нам підійде any
        Echo: Echo<any>
    }
}