import BaseService from "../core/BaseService";
import { IServiceCredentials } from "./CloudFoundryService";
import ServiceManagerService, { IServiceInstance, IServiceManagementBinding } from "./ServiceManagerService";

export interface ISubAccount {
    guid:string;
    technicalName:string;
    displayName:string;
    globalAccountGUID:string;
    parentGUID:string;
    parentType:string;
    region:string;
    subdomain:string;
    betaEnabled:string;
    usedForProduction:string;
    description:string;
    state:string;
    stateMessage:string;
    serviceBinding?:IServiceManagementBinding;
    serviceCredentials?:IServiceCredentials;
    serviceInstance?:IServiceInstance;
    status?:string;
    cfAPI?:string;
};

export default class BTPService extends BaseService {
    constructor() {
        super("BTP_SRV");
    }

    public getSubAccounts(){
        return (this.getService().send({
            method:"GET",
            path: "subaccounts"
        }) as Promise<{value:Array<ISubAccount>}>);
    }
    public getSubAccount(id:string){
        return (this.getService().send({
            method:"GET",
            path: `subaccounts/${id}`
        }) as Promise<ISubAccount>);
    }
    
    public getSubAccountServiceManagementBinding(subaccountid:string){
        return (this.getService().send({
            method:"GET",
            path: `subaccounts/${subaccountid}/serviceManagementBinding`
        }).catch(error => {throw `Error when GET serviceManagementBinding for ${subaccountid}`}) as Promise<IServiceManagementBinding>);
    }
    
    public createSubAccountServiceManagementBinding(subaccountid:string){
        return (this.getService().send({
            method:"POST",
            path: `subaccounts/${subaccountid}/serviceManagementBinding`
        }).catch(error => {throw `Error when POST serviceManagementBinding for ${subaccountid}`}) as Promise<IServiceManagementBinding>);
    }
    public async getServiceManagementBindingSubAccount(subaccount:ISubAccount){
        try {
            subaccount.serviceBinding = await this.getSubAccountServiceManagementBinding(subaccount.guid);
        } catch (error) {
            console.error(error);
            console.error("error, probably doesn't exists yet. Let's create service management binding:");
            try {
                subaccount.serviceBinding = await this.createSubAccountServiceManagementBinding(subaccount.guid);
            } catch (error) {
                console.error(error);
                console.error("error, could not create service bindings");
                // throw error;
                subaccount.status = "Could not create service bindings for this subaccount";
            }
        }
        return subaccount;
    }
    public async getAllServiceManagementBindings(id?:string){
        let smbinding:IServiceManagementBinding;
        let subaccounts = id?{value:[(await this.getSubAccount(id))]}:await this.getSubAccounts();
        console.log(subaccounts);
        const subaccountDetails = await Promise.all(subaccounts.value
            // .filter(subacc=>subacc.subdomain === "b-fdn-dev")//for testing purpose
            .map(subaccount=>this.getServiceManagementBindingSubAccount(subaccount)));
            
        return Promise.all(subaccountDetails
                .filter(subaccount=>!subaccount.status)//only continue when it has no error in status
                .map(async (subaccount)=>{
                const smManager = new ServiceManagerService(subaccount);
                let subacc:ISubAccount = subaccount;
                try{
                    subacc = await smManager.getCFServiceInstance('auditlog-management');
                }catch(error){
                    console.error(`SA: ${subacc.displayName} - CF: ${subacc.cfAPI}`)
                    console.error(error);
                    subacc.status = error as string;
                    if ((error as {message:string})?.message) {
                        subacc.status = (error as {message:string}).message;
                    }
                }
                return subacc;
            }));

    }



}