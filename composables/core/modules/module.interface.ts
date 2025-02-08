export interface BasicModuleInterface {
    get(params:object):Promise<any>
    getById(id:any):Promise<any>
    post(data:any):Promise<any>
    put(id:any, data:any):Promise<any>
    patch(id:any, data:any):Promise<any>
    delete(id:any):Promise<any>
}

export interface AuthModuleInterface {
    doRegistration(data:any):BasicModuleInterface
    doLogin(data:any):BasicModuleInterface
    doLogout():BasicModuleInterface
    getStore():BasicModuleInterface
}