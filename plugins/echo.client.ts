// plugins/echo.client.ts
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
    const cfg = useRuntimeConfig().public as {
            reverbKey?: string
            reverbHost?: string
            reverbPort?: string | number
            reverbScheme?: string
        }

        // зробимо доступним глобально (якщо десь є старий код, що покладається на window.Pusher)
    ;(globalThis as any).Pusher = Pusher

    const secure = (cfg.reverbScheme ?? 'https') === 'https'
    const port = Number(cfg.reverbPort) || (secure ? 443 : 80)

    const echo = new Echo({
        broadcaster: 'reverb',               // якщо використовуєш Reverb
        key: cfg.reverbKey!,
        wsHost: cfg.reverbHost || window.location.hostname,
        wsPort: port,
        wssPort: port,
        forceTLS: secure,
        enabledTransports: ['ws', 'wss'],
        disableStats: true,

        // ГОЛОВНЕ: явно передаємо клієнт
        client: Pusher,

        // Якщо приватні/присутні канали — кастомний authorizer, щоб летіли cookies
        authorizer: (channel: any) => ({
            authorize: (socketId: string, callback: any) => {
                $fetch('/broadcasting/auth', {
                    method: 'POST',
                    credentials: 'include',
                    body: { socket_id: socketId, channel_name: channel.name },
                })
                    .then((res) => callback(false, res))
                    .catch((err) => callback(true, err))
            },
        }),
    })

    nuxtApp.provide('echo', echo)
})
