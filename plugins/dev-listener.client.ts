import {defineNuxtPlugin} from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
    const echo = (nuxtApp as any).$echo || (window as any).Echo
    if (!echo) return

    echo.channel('test')
        .listen('ц', (data: any) => {
            console.log('[dev] Ping received', data)
        })
})