import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
    state: () => ({
        byTicket: {} as Record<string, {
            messages: Array<any>,
            hasMore: boolean,
            loadingOlder: boolean,
            subscribed: boolean,
        }>
    }),
    actions: {
        ensureTicket(ticketId: string) {
            if (!this.byTicket[ticketId]) {
                this.byTicket[ticketId] = { messages: [], hasMore: true, loadingOlder: false, subscribed: false }
            }
        },
        prepend(ticketId: string, older: any[]) {
            const s = this.byTicket[ticketId]; if (!s) return
            // уникаємо дублів
            const known = new Set(s.messages.map(m => m.id))
            const merged = older.filter(m => !known.has(m.id))
            s.messages = [...merged, ...s.messages]
        },
        append(ticketId: string, msg: any) {
            const s = this.byTicket[ticketId]; if (!s) return
            if (s.messages.find(m => m.id === msg.id)) return
            s.messages.push(msg)
        }
    }
})
