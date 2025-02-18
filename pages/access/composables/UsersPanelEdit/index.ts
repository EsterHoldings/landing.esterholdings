import {reactive} from "vue";

export const formData:any = reactive({
    roles: []
})

export const errorsFormDataObject:any = reactive({
    roles: {
        isDirty: false,
        errors: []
    }
})