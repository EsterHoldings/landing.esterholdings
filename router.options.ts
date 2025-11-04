// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
    scrollBehavior(to, from, savedPosition) {
        // 1. Если это back/forward в браузере — верни сохранённую позицию
        if (savedPosition) {
            return savedPosition
        }

        // 2. Если это тот же маршрут (например, только локаль изменилась),
        //    не скроль наверх, просто оставайся
        if (to.fullPath.split('#')[0] === from.fullPath.split('#')[0]) {
            return false
        }

        // 3. Стандартное поведение: новый роут -> в верх
        return { left: 0, top: 0 }
    },
}
