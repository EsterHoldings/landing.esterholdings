import mitt from "mitt";

const eventBus = mitt<Record<string, any>>();
export default eventBus;