import {reactive} from "vue";

export const formData:any = reactive({
    id: '',
    email: '',
    roles: [],
})

export const errorsFormDataObject:any = reactive({
    roles: {
        isDirty: false,
        errors: []
    }
})