import {defineNuxtPlugin, useRuntimeConfig} from "nuxt/app";


export default defineNuxtPlugin(async () => {
    const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:8000'

    await $fetch(`${apiBase}/sanctum/csrf-cookie`, {
        credentials: 'include',
    })
})