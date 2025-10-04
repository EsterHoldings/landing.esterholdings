// plugins/echo.client.ts
// @ts-ignore
import Echo from 'laravel-echo'
// @ts-ignore
import type EchoType from 'laravel-echo'
// @ts-ignore
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { USER_ACCESS_TOKEN } from '~/constants/auth'

declare global {
    interface Window { Echo: EchoType<any> }
}

export default defineNuxtPlugin(() => {
    const cfg = useRuntimeConfig().public as {
        apiBase?: string
        reverbKey?: string
        reverbHost?: string
        reverbPort?: string | number
        reverbScheme?: string
    }

    const apiBase = (cfg.apiBase || 'http://localhost:8000').replace(/\/+$/, '')
    const scheme = (cfg.reverbScheme || 'http').toLowerCase()
    const port = Number(cfg.reverbPort ?? (scheme === 'https' ? 443 : 80))
    const useTLS = scheme === 'https'

    // Якщо використовуєш bearer токен — залишаємо; якщо Sanctum через куки, можна прибрати Authorization
    const token = (typeof localStorage !== 'undefined')
        ? (localStorage.getItem(USER_ACCESS_TOKEN) || '')
        : ''

    const xsrf = (typeof document !== 'undefined')
        ? (document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1] ?? '')
        : ''

    const echo = new Echo({
        broadcaster: 'reverb',
        key: cfg.reverbKey,
        // Reverb/WS
        wsHost: cfg.reverbHost,     // esterholdings.website
        wsPort: port,               // 443 на проді
        wssPort: port,              // 443 на проді
        wsPath: '/app',             // під Nginx location /app/
        forceTLS: useTLS,           // true для https
        enabledTransports: useTLS ? ['wss', 'ws'] : ['ws'],

        // Auth (приватні/присутні канали)
        authEndpoint: `${apiBase}/broadcasting/auth`,
        withCredentials: true,
        auth: {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                'X-Requested-With': 'XMLHttpRequest',
                ...(xsrf ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrf) } : {}),
            },
        },
    })

    // @ts-ignore
    window.Echo = echo
    return { provide: { echo } }
})
