<template>
  <!-- ROOT: фіксована панель; інлайн-стилі керують top/left/width/height -->
  <div
      class="support-chat flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--ui-primary-main)] bg-[var(--color-stroke-ui-dark)] shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
      :style="panelStyle"
      @mousedown.stop
      @touchstart.stop
  >
    <!-- Header (drag handle) -->
    <div
        class="relative flex items-center justify-between border-b border-[#2a3f73] px-4 py-3 select-none cursor-move"
        @mousedown="onDragStart"
        @touchstart="onDragStart"
    >
      <div class="flex items-center gap-3">
        <h3 class="text-lg font-semibold text-white/95">Support Chat</h3>
        <div class="flex items-center gap-2 text-sm">
          <span class="inline-flex h-2.5 w-2.5 rounded-full bg-gray-400"></span>
          <span class="text-white/80">Offline</span>
        </div>
      </div>
      <button
          @click="emit('close')"
          class="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white/90"
          title="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
          <path
              d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.41 6.29 6.29-6.3 6.3 1.41 1.4 6.3-6.29 6.29 6.3 1.41-1.41-6.3-6.3 6.3-6.29z"/>
        </svg>
      </button>

      <!-- тонка зона для ресайзу зверху/збоку (необов'язково, основний — кут) -->
      <div class="absolute inset-x-0 -bottom-1 h-2 cursor-ns-resize" @mousedown.stop="onResizeStart('s',$event)"
           @touchstart.stop="onResizeStart('s',$event)"></div>
      <div class="absolute inset-y-0 -right-1 w-2 cursor-ew-resize" @mousedown.stop="onResizeStart('e',$event)"
           @touchstart.stop="onResizeStart('e',$event)"></div>
    </div>

    <div
        v-if="isLoading"
        class="absolute left-0 top-[60px] right-0 bottom-[80px] flex items-center justify-center z-10 backdrop-blur-sm p-4"
    >
      <UiIconSpinnerDefault/>
    </div>

    <!-- Messages -->
    <div ref="listRef" class="messages flex-1 space-y-6 overflow-y-auto no-scrollbar px-4 py-5">
      <div class="flex items-center gap-3 text-white/70" v-if="messages.length">
        <span class="h-px flex-1 bg-white/10"></span>
        <span class="text-sm">Today</span>
        <span class="h-px flex-1 bg-white/10"></span>
      </div>

      <template v-for="m in messages" :key="m.id">
        <!-- left (support) -->
        <div v-if="!isMe(m)" class="flex items-end gap-3">
          <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2962ff] text-sm font-semibold text-white">
            S
          </div>
          <div
              class="max-w-[80%] rounded-[10px] bg-[#2c61ff] p-2 text-[15px] leading-6 text-white ring-1 ring-[#5b8cff]">
            <p class="whitespace-pre-wrap break-words">{{ m.body }}</p>
            <div class="mt-1 text-[12px] text-white/70">{{ formatTime(m.createdAt) }}</div>
          </div>
        </div>

        <!-- right (me) -->
        <div v-else class="flex items-end justify-end gap-3">
          <div
              class="max-w-[82%] rounded-[10px] bg-[#2563ff] p-2 text-[15px] leading-6 text-white ring-1 ring-[#5b8cff]">
            <p class="whitespace-pre-wrap break-words">{{ m.body }}</p>
            <div class="mt-1 text-right text-[12px] text-white/80">{{ formatTime(m.createdAt) }}</div>
          </div>
          <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff7a1a] text-sm font-semibold text-white">
            M
          </div>
        </div>
      </template>

      <div v-if="!messages.length && !isLoading" class="text-center text-white/60">No messages yet</div>
    </div>

    <!-- Composer -->
    <div class="border-t border-[#2a3f73] p-3">
      <div class="flex items-center gap-2 rounded-2xl bg-[#0a2a74]/50 p-2 ring-1 ring-[#2a3f73]">
        <textarea
            ref="inputRef"
            v-model="draft"
            rows="1"
            @keydown.enter.prevent="send"
            @keydown.shift.enter.stop
            class="max-h-28 flex-1 resize-none bg-transparent py-2 text-[15px] text-white placeholder:text-white/60 outline-none"
            placeholder="Write your message"
        />
        <button
            :disabled="!canSend"
            @click="send"
            class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563ff] text-white ring-1 ring-[#5b8cff] hover:bg-[#2b6dff] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
            <path d="m2.01 21 20-9L2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Resize handle (кут) -->
    <div
        class="absolute bottom-1 right-1 h-4 w-4 cursor-nwse-resize rounded-sm"
        :class="dragging ? 'bg-white/30' : 'bg-white/10'"
        title="Resize"
        @mousedown.stop="onResizeStart('se', $event)"
        @touchstart.stop="onResizeStart('se', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount, nextTick, reactive} from 'vue'
import {useNuxtApp} from 'nuxt/app'
import useAppCore from '~/composables/useAppCore'
import UiIconSpinnerDefault from '~/components/ui/UiIconSpinnerDefault.vue'

type ChatMessage = { id: string; author: 'me' | 'support' | 'other'; body: string; createdAt: number }
type ApiMsg = {
  id: string;
  ticket_id: string;
  user_id: any;
  type: string;
  body: string | null;
  meta: any;
  created_at: string
}

const props = defineProps<{ ticketId: any; currentUser: { id: any; name: string }, adminChat: false }>()
const emit = defineEmits(['close'])

/* ========= Drag / Resize state ========= */
const pos = reactive({
  top: 0,
  left: 0,
  width: 380,
  height: 540,
})
const minW = 320
const minH = 420
const margin = 16 // відповідає bottom-4/right-4
const dragging = ref(false)
const resizing = ref<null | 'se' | 'e' | 's'>(null)
let dragStart = {x: 0, y: 0, left: 0, top: 0}
let sizeStart = {x: 0, y: 0, w: 0, h: 0}

const panelStyle = computed(() => ({
  position: 'fixed',
  // перекриваємо класові right/bottom
  right: 'auto',
  bottom: 'auto',
  top: `${pos.top}px`,
  left: `${pos.left}px`,
  width: `${pos.width}px`,
  height: `${pos.height}px`,
  // запобігти виділенню під час drag/resize
  userSelect: dragging.value || resizing.value ? 'none' : undefined,
}))

function clampToViewport() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  pos.width = Math.max(minW, Math.min(pos.width, vw - 2 * margin))
  pos.height = Math.max(minH, Math.min(pos.height, vh - 2 * margin))
  pos.left = Math.max(0, Math.min(pos.left, vw - pos.width - margin))
  pos.top = Math.max(0, Math.min(pos.top, vh - pos.height - margin))
}

function initPosition() {
  // мобільно: повна ширина мінус відступ; десктоп: 380
  const isMobile = window.innerWidth < 768
  pos.width = isMobile ? Math.max(minW, window.innerWidth - margin * 2) : 380
  pos.height = isMobile ? Math.max(minH, Math.round(window.innerHeight * 0.7)) : 540
  pos.left = window.innerWidth - pos.width - margin
  pos.top = window.innerHeight - pos.height - margin
  clampToViewport()
}

/* Drag handlers */
function onDragStart(e: MouseEvent | TouchEvent) {
  // не починати drag, якщо клікаємо по кнопці/textarea всередині хедера
  const t = e.target as HTMLElement
  if (t.closest('button')) return
  dragging.value = true
  const p = getPoint(e)
  dragStart = {x: p.x, y: p.y, left: pos.left, top: pos.top}
  addWindowListeners()
  document.body.style.cursor = 'grabbing'
}

function onDragMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  const p = getPoint(e)
  pos.left = dragStart.left + (p.x - dragStart.x)
  pos.top = dragStart.top + (p.y - dragStart.y)
  clampToViewport()
}

function onDragEnd() {
  if (!dragging.value) return
  dragging.value = false
  removeWindowListeners()
  document.body.style.cursor = ''
}

/* Resize handlers */
function onResizeStart(dir: 'se' | 'e' | 's', e: MouseEvent | TouchEvent) {
  resizing.value = dir
  const p = getPoint(e)
  sizeStart = {x: p.x, y: p.y, w: pos.width, h: pos.height}
  addWindowListeners()
  document.body.style.cursor = dir === 'e' ? 'ew-resize' : dir === 's' ? 'ns-resize' : 'nwse-resize'
}

function onResizeMove(e: MouseEvent | TouchEvent) {
  if (!resizing.value) return
  const p = getPoint(e)
  const dx = p.x - sizeStart.x
  const dy = p.y - sizeStart.y
  if (resizing.value === 'se' || resizing.value === 'e') pos.width = sizeStart.w + dx
  if (resizing.value === 'se' || resizing.value === 's') pos.height = sizeStart.h + dy
  clampToViewport()
}

function onResizeEnd() {
  if (!resizing.value) return
  resizing.value = null
  removeWindowListeners()
  document.body.style.cursor = ''
}

/* Helpers for pointer */
function getPoint(e: MouseEvent | TouchEvent) {
  if (e instanceof TouchEvent) {
    const t = e.touches[0] || e.changedTouches[0]
    return {x: t.clientX, y: t.clientY}
  }
  return {x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY}
}

function addWindowListeners() {
  window.addEventListener('mousemove', onAnyMove, {passive: false})
  window.addEventListener('mouseup', onAnyEnd, {passive: false})
  window.addEventListener('touchmove', onAnyMove, {passive: false})
  window.addEventListener('touchend', onAnyEnd, {passive: false})
}

function removeWindowListeners() {
  window.removeEventListener('mousemove', onAnyMove)
  window.removeEventListener('mouseup', onAnyEnd)
  window.removeEventListener('touchmove', onAnyMove)
  window.removeEventListener('touchend', onAnyEnd)
}

function onAnyMove(e: MouseEvent | TouchEvent) {
  if (dragging.value) onDragMove(e)
  if (resizing.value) onResizeMove(e)
}

function onAnyEnd() {
  onDragEnd()
  onResizeEnd()
}

/* ========= Chat logic (як у тебе) ========= */
const listRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const isLoading = ref(false)
const draft = ref('')
const PAGE_SIZE = 6
const page = ref(1)
const hasMore = ref(true)

const readyForInfinite = ref(false)
const isNearBottom = (el: HTMLElement, px = 16) =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - px

const messages = reactive<ChatMessage[]>([])

const isMe = (m: ChatMessage) => m.author === 'me'
const canSend = computed(() => draft.value.trim().length > 0)
const formatTime = (ts: number) =>
    new Intl.DateTimeFormat('uk-UA', {hour: '2-digit', minute: '2-digit'}).format(new Date(ts))

const mapApi = (m: ApiMsg): ChatMessage => ({
  id: m.id,
  author: m.user_id === props.currentUser.id ? 'me' : 'other',
  body: m.body ?? '',
  createdAt: Date.parse(m.created_at) || Date.now(),
})

function scrollToBottom() {
  const el = listRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

/* data loading */
const appCore = useAppCore()

async function loadPage(p: number) {
  let res: any = null;
  if (props.adminChat) {
    res = await appCore.adminModules.tickets.getTicketMessages(props.ticketId, {page: p, pageSize: PAGE_SIZE})
  } else {
    res = await appCore.tickets.getTicketMessages(props.ticketId, {page: p, pageSize: PAGE_SIZE})
  }
  const arr: ApiMsg[] = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? [])
  return arr.map(mapApi)
}

async function loadInitial() {
  isLoading.value = true
  try {
    const items = await loadPage(page.value)
    messages.splice(0, messages.length, ...items)
    await nextTick();
    scrollToBottom()
    await nextTick();
    scrollToBottom()
    hasMore.value = items.length === PAGE_SIZE
  } finally {
    setTimeout(() => {
      readyForInfinite.value = true
    }, 0)
    setTimeout(() => {
      scrollToBottom();
      isLoading.value = false
    }, 500)
  }
}

let loadingMore = false

async function loadMoreAbove() {
  if (loadingMore || !hasMore.value) return
  loadingMore = true
  const el = listRef.value!
  const prevHeight = el.scrollHeight

  page.value += 1
  const items = await loadPage(page.value)
  if (items.length === 0) {
    hasMore.value = false
    loadingMore = false
    return
  }

  messages.splice(0, 0, ...items)
  await nextTick()
  el.scrollTop = el.scrollHeight - prevHeight

  if (items.length < PAGE_SIZE) hasMore.value = false
  loadingMore = false
}

function onScroll() {
  const el = listRef.value
  if (!el || loadingMore || !hasMore.value || !readyForInfinite.value) return
  if (el.scrollTop <= 400) loadMoreAbove()
}

/* Echo */
const {$echo} = useNuxtApp()

onMounted(async () => {
  initPosition()
  await loadInitial()
  listRef.value?.addEventListener('scroll', onScroll, {passive: true})

  const channel = $echo.private(`chat.${props.ticketId}`)
  channel.listen('.MessageSent', async (e: any) => {
    const el = listRef.value
    const stick = !!el && isNearBottom(el)
    const msg: ApiMsg = {
      id: e.id,
      ticket_id: e.ticket_id,
      user_id: e.user_id,
      type: e.type,
      body: e.body,
      meta: e.meta,
      created_at: e.created_at
    }
    messages.splice(messages.length, 0, mapApi(msg))
    if (stick) {
      await nextTick();
      scrollToBottom()
    }
    scrollToBottom()
  })

  window.addEventListener('resize', onViewportResize)
})

function onViewportResize() {
  clampToViewport()
}

onBeforeUnmount(() => {
  listRef.value?.removeEventListener('scroll', onScroll)
  try {
    $echo.leave(`chat.${props.ticketId}`)
  } catch {
  }
  removeWindowListeners()
  window.removeEventListener('resize', onViewportResize)
})

/* send */
async function send() {
  if (!canSend.value) return
  const body = draft.value.trim()
  draft.value = ''

  if (props.adminChat) {
    await appCore.adminModules.tickets.storeTicketMessage(props.ticketId, {
      user_id: props.currentUser.id,
      type: 'text',
      body: body,
    })
  } else {
    await appCore.tickets.storeTicketMessage(props.ticketId, {
      user_id: props.currentUser.id,
      type: 'text',
      body: body,
    })
  }

  nextTick().then(scrollToBottom)
}
</script>

<style>
.dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, .9);
  display: inline-block;
  animation: blink 1s infinite
}

.delay-150 {
  animation-delay: .15s
}

.delay-300 {
  animation-delay: .3s
}

@keyframes blink {
  0%, 80%, 100% {
    opacity: .2;
    transform: translateY(0)
  }
  40% {
    opacity: 1;
    transform: translateY(-1px)
  }
}
</style>