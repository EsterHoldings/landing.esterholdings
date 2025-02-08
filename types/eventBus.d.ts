// types/nuxt.d.ts
import mitt, { Emitter } from "mitt";

type Events = {
    [key: string]: any;
};

declare module "#app" {
    interface NuxtApp {
        $eventBus: Emitter<Events>;
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $eventBus: Emitter<Events>;
    }
}