import type Echo from 'laravel-echo'
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useNuxtApp, useRuntimeConfig} from "nuxt/app";


export interface UserRef { id: number | string; name?: string; avatar?: string }
export interface MessageDto {
    id: string
    ticket_id: string
    user_id: number | string
    type: 'text' | 'system' | 'attachment'
    body: string | null
    meta?: Record<string, any> | null
    created_at: string
}


export interface UiMessage {
    id: string
    ticketId: string
    userId: number | string
    type: 'text' | 'system' | 'attachment'
    body: string
    meta?: Record<string, any> | null
    createdAt: string
    readBy?: Array<number | string>
}

export function useSupportChat(ticketId: string, currentUser: UserRef) {
    const cfg = useRuntimeConfig()
    // @ts-ignore
    const {$echo} = useNuxtApp() as { $echo: Echo }

    // state
    const messages = ref<UiMessage[]>([])
    const typingUsers = ref<Set<number | string>>(new Set())
    const members = ref<UserRef[]>([]) // presence members
    const isConnected = ref(false)
    const isLoading = ref(false)

    // derived
    const peers = computed(() => members.value.filter(m => String(m.id) !== String(currentUser.id)))
    const peer = computed<UserRef | null>(() => peers.value[0] || null)
    const isPeerOnline = computed(() => peers.value.length > 0)


// helpers
    function mapDtoToUi(m: MessageDto): UiMessage {
        return {
            id: m.id,
            ticketId: m.ticket_id,
            userId: m.user_id,
            type: m.type,
            body: m.body ?? '',
            meta: m.meta ?? undefined,
            createdAt: m.created_at,
            readBy: [],
        }
    }

    async function fetchMessages(page = 1) {
        isLoading.value = true
        try {
            const res = await $fetch<{ data: MessageDto[] }>(`${cfg.public.apiBase}/api/tickets/${ticketId}/messages`, {
                params: { page },
                credentials: 'include',
            })
            const chunk = res.data.map(mapDtoToUi)
            messages.value = [...messages.value, ...chunk]
        } finally { isLoading.value = false }
    }


// sockets
    let privateCh: any | null = null
    let presenceCh: any | null = null


    function connect() {
        if (isConnected.value) return
        isConnected.value = true


        privateCh = (useNuxtApp() as any).$echo
            .private(`ticket.${ticketId}`)
            .listen('.MessageSent', (e: MessageDto) => {
                messages.value.push(mapDtoToUi(e))
                scrollToBottomSoon()
            })
            .listen('.MessageRead', (e: { user_id: number | string; message_id: string }) => {
                const idx = messages.value.findIndex(m => m.id === e.message_id)
                if (idx !== -1) {
                    const set = new Set(messages.value[idx].readBy ?? [])
                    set.add(e.user_id)
                    messages.value[idx].readBy = Array.from(set)
                }
            })


        presenceCh = (useNuxtApp() as any).$echo
            .join(`presence:ticket.${ticketId}`)
            .here((users: UserRef[]) => { members.value = users })
            .joining((u: UserRef) => { members.value = [...members.value, u] })
            .leaving((u: UserRef) => { members.value = members.value.filter(m => String(m.id) !== String(u.id)) })
            .listen('.Typing', (e: { user_id: number | string; is_typing: boolean }) => {
                if (String(e.user_id) === String(currentUser.id)) return
                if (e.is_typing) typingUsers.value.add(e.user_id)
                else typingUsers.value.delete(e.user_id)
                typingUsers.value = new Set(typingUsers.value) // trigger reactivity
            })
    }

    function disconnect() {
        if (privateCh) { privateCh.stopListening('.MessageSent').stopListening('.MessageRead') }
        if (presenceCh) { (useNuxtApp() as any).$echo.leave(`presence:ticket.${ticketId}`) }
        privateCh = null; presenceCh = null; isConnected.value = false
    }


// API actions
    async function sendMessage(body: string) {
        const res = await $fetch<MessageDto>(`${cfg.public.apiBase}/api/tickets/${ticketId}/messages`, {
            method: 'POST', body: { body }, credentials: 'include',
        })
// Optimistic already handled; but keep server copy canonical
        messages.value.push(mapDtoToUi(res))
    }


    async function setTyping(isTyping: boolean) {
// debounce/throttle on caller side if needed
        await $fetch(`${cfg.public.apiBase}/api/tickets/${ticketId}/typing`, {
            method: 'POST', body: { is_typing: isTyping }, credentials: 'include',
        })
    }

    async function markRead(lastMessageId: string) {
        await $fetch(`${cfg.public.apiBase}/api/tickets/${ticketId}/read`, {
            method: 'POST', body: { last_message_id: lastMessageId }, credentials: 'include',
        })
    }


// tiny UX helper (client-only)
    function scrollToBottomSoon() {
        if (!process.client) return
        requestAnimationFrame(() => {
            const el = document.querySelector('.support-chat .messages') as HTMLElement | null
            el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
        })
    }

    onMounted(async () => {
        connect()
        await fetchMessages(1)
        scrollToBottomSoon()
    })
    onBeforeUnmount(disconnect)


    return {
// state
        messages, members, typingUsers, isConnected, isLoading,
        peer, isPeerOnline,
// actions
        fetchMessages, sendMessage, setTyping, markRead, connect, disconnect,
    }
}