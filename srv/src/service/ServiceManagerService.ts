import { executeHttpRequest } from "@sap-cloud-sdk/http-client";
import BaseService from "../core/BaseService";
import CloudFoundryService, { IServiceCredentials } from "./CloudFoundryService";
import { ISubAccount } from "./BTPService";
import ProvisioningService, { IProvisioningInstance } from "./ProvisioningService";

export interface IServiceManagementBinding {
  clientid: string;
  clientsecret: string;
  sm_url: string;
  url: string;
  xsappname: string;
}
export interface IServiceInstance {
  id: string;
  name?: string;
  context?: {
    landscape_label: string;
    env_type: string;
    space_guid: string;
    space_name: string;
    organization_guid: string;
    organization_name: string;
    region: string;
  }
}
export interface IServiceInstances {
  items: Array<IServiceInstance>
}

export default class ServiceManagerService {
  private subaccount: ISubAccount;
  private cfService: CloudFoundryService;
  static readonly CFruntime = "CF";
  static readonly BTPruntime = "BTP";
  constructor(subaccount: ISubAccount) {
    this.subaccount = subaccount;
  }

  public autenticate() {
    return executeHttpRequest({
      url: `${this.subaccount?.serviceBinding?.url}/oauth/token?grant_type=client_credentials`
    }, {
      method: 'get',
      headers: {
        Authorization: `Basic ${btoa(`${this.subaccount?.serviceBinding?.clientid}:${this.subaccount?.serviceBinding?.clientsecret}`)}`
      }
    });
  }
  public getServiceOffering(token: string, offeringName: string) {
    return executeHttpRequest({ url: `${this.subaccount?.serviceBinding?.sm_url}/v1/service_offerings?fieldQuery=name eq '${offeringName}'` }, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  public getServicePlan(token: string, serviceOfferID: string, planName: string) {
    return executeHttpRequest({ url: `${this.subaccount?.serviceBinding?.sm_url}/v1/service_plans?fieldQuery=service_offering_id eq '${serviceOfferID}' and name eq '${planName}'` }, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  public async getServiceInstance(token: string, offeringName: string, servicePlanID: string) {
    const instances = await executeHttpRequest({ url: `${this.subaccount?.serviceBinding?.sm_url}/v1/service_instances?fieldQuery=service_plan_id eq '${servicePlanID}' and name eq '${offeringName}-service'` }, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let instance;
    if (instances?.data?.items?.length > 0) {
      //if more then one, look for one with the same name as created by this application
      const foundInstance = instances.data.items.find((item: IServiceInstance) =>
        (item.name === `${offeringName}-service`)// && item.context?.env_type === 'cloudfoundry' && item.context?.space_name === 'TECH')
        // || (item.context?.env_type === 'cloudfoundry' && item.context?.space_name === 'TECH')
        // || (item.context?.env_type === 'cloudfoundry')
      );
      if (foundInstance) {
        instance = foundInstance;
      }
    }
    return instance;
  }
  public createServiceInstance(token: string, offeringName: string, servicePlanID: string,parameters?:any) {
    // this.cfService.getServiceInstanceCredentialsByID();
    parameters = parameters || {}
    return executeHttpRequest({ url: `${this.subaccount?.serviceBinding?.sm_url}/v1/service_instances?async=false` }, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        "name": `${offeringName}-service`,
        "service_plan_id": servicePlanID,
        "parameters":parameters
      }
    }
    );
  }
  public createServiceBinding(token: string, offeringName: string, serviceInstanceID: string) {
    // this.cfService.getServiceInstanceCredentialsByID();
    return executeHttpRequest({ url: `${this.subaccount?.serviceBinding?.sm_url}/v1/service_bindings?async=false` }, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        "name": `${offeringName}-service-key`,
        "service_instance_id": serviceInstanceID
      }
    }
    );
  }
  public getServiceBinding(token: string, offeringName: string, serviceInstanceID: string) {
    // this.cfService.getServiceInstanceCredentialsByID();
    return executeHttpRequest({ url: `${this.subaccount?.serviceBinding?.sm_url}/v1/service_bindings?fieldQuery=service_instance_id eq '${serviceInstanceID}' and name eq '${offeringName}-service-key'` }, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  public async getCFServiceInstance(serviceName:string) {//'auditlog-management'
    const cisInstance = await this.getServiceInstances('cis', 'local',ServiceManagerService.BTPruntime,{"grantType": "clientCredentials"});
    const provisioning = new ProvisioningService(cisInstance.serviceCredentials as unknown as IProvisioningInstance);
    const cfAPI = await provisioning.getCloudFoundryRuntimeURL();
    if (!cfAPI) {
      throw `CloudFoundry runtime not found for ${this.subaccount.displayName}`;
    }
    console.log(`CloudFoundry runtime found for ${this.subaccount.displayName}`);
    this.cfService = new CloudFoundryService(cfAPI||"");
    
    //https://provisioning-service.cfapps.<region>.hana.ondemand.com/provisioning/v1/environments
    const result = await this.getServiceInstances(serviceName, 'default', ServiceManagerService.CFruntime);
    this.subaccount.serviceInstance = result.serviceInstance;
    this.subaccount.serviceCredentials = result.serviceCredentials;
    return this.subaccount;
  }
  public async getServiceInstances(offeringName: string, planName: string, runtime?: string,parameters?:any) {//}: Promise<IServiceInstance> {
    const token = await this.autenticate();
    const offering = await this.getServiceOffering(token.data.access_token, offeringName);
    if (!offering.data.items || offering.data.items.length === 0) {
      throw `Service offering not found for ${offeringName} - SA: ${this.subaccount.displayName}`;
    }
    console.log(`Service offering found for ${offeringName} - SA: ${this.subaccount.displayName}`);
    const plan = await this.getServicePlan(token.data.access_token, offering.data.items[0].id, planName)
    if (!plan.data.items || plan.data.items.length === 0) {
      throw `Service plan not found for offering ${offering.data.items[0].name} - SA: ${this.subaccount.displayName}`;
    }
    console.log(`Service plan found for offering ${offering.data.items[0].name} - SA: ${this.subaccount.displayName}`);
    let instance = await this.getServiceInstance(token.data.access_token, offeringName, plan?.data.items[0].id);
    //if not found ==> create one
    if (!instance) {
      if (runtime && runtime === ServiceManagerService.CFruntime) {
        await this.cfService.createServiceInstance(plan?.data.items[0].catalog_id, this.subaccount.subdomain,`${offeringName}-service`);
      } else {
        const bptInstance = await this.createServiceInstance(token.data.access_token, offeringName, plan?.data.items[0].id,{"grantType": "clientCredentials"});
      }
      instance = await this.getServiceInstance(token.data.access_token, offeringName, plan?.data.items[0].id);
    }
    if (!instance) {
      throw `Instance found and could be created for plan ${plan.data.items[0].name} - SA: ${this.subaccount.displayName}`;
    }
    console.log(`Instance found and could be created for plan ${plan.data.items[0].name} - SA: ${this.subaccount.displayName}`);
   
    let result = {
      serviceInstance:instance,
      serviceCredentials:undefined
    }
    if (runtime && runtime === ServiceManagerService.CFruntime) {
      result.serviceCredentials = await this.cfService.getServiceInstanceCredentialsByID(instance);
    }else{
      result.serviceCredentials = (await this.getServiceBinding(token.data.access_token, offeringName,instance.id)).data?.items[0];
      if(!result.serviceCredentials) {
        result.serviceCredentials = (await this.createServiceBinding(token.data.access_token,offeringName,instance.id)).data;
      }
    }
    // { this.subaccount.serviceCredentials } = credentialsResponse?.data as IServiceCredentials;
    return result;
    // if (instance?.data?.items.length > 0) {
    //   return instance?.data.items[0] as IServiceInstance;
    // }
    // const newInstance = await this.createServiceInstance(token.data.access_token,plan?.data.items[0].id);
    // return newInstance.data;
  }

}