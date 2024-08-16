import { executeHttpRequest } from "@sap-cloud-sdk/http-client";
import BaseService from "../core/BaseService";
import { IServiceCredentials } from "./CloudFoundryService";
import { ISubAccount } from "./BTPService";

export interface IProvisioningInstance {
  id: string
  ready: boolean
  last_operation: ILastOperation
  name: string
  service_instance_id: string
  context: IContext
  credentials: ICredentials
  subaccount_id: string
  created_at: string
  updated_at: string
  labels: ILabels
}

export interface ILastOperation {
  id: string
  ready: boolean
  type: string
  state: string
  resource_id: string
  resource_type: string
  platform_id: string
  correlation_id: string
  reschedule: boolean
  reschedule_timestamp: string
  deletion_scheduled: string
  created_at: string
  updated_at: string
}

export interface IContext {
  crm_customer_id: string
  env_type: string
  global_account_id: string
  instance_name: string
  license_type: string
  origin: string
  platform: string
  region: string
  service_instance_id: string
  subaccount_id: string
  subdomain: string
  zone_id: string
}

export interface ICredentials {
  endpoints: IEndpoints
  grant_type: string
  "sap.cloud.service": string
  uaa: IUaa
}

export interface IEndpoints {
  account_context_service_url: string
  accounts_service_url: string
  cloud_automation_url: string
  entitlements_service_url: string
  events_service_url: string
  metadata_service_url: string
  order_processing_url: string
  provisioning_service_url: string
  saas_registry_service_url: string
}

export interface IUaa {
  apiurl: string
  clientid: string
  clientsecret: string
  "credential-type": string
  identityzone: string
  identityzoneid: string
  sburl: string
  serviceInstanceId: string
  subaccountid: string
  tenantid: string
  tenantmode: string
  uaadomain: string
  url: string
  verificationkey: string
  xsappname: string
  xsmasterappname: string
  zoneid: string
}

export interface ILabels {
  subaccount_id: string[]
}
export interface IRuntimes {
  environmentInstances: IEnvironmentInstance[]
}

export interface IEnvironmentInstance {
  id: string
  name: string
  brokerId: string
  globalAccountGUID: string
  subaccountGUID: string
  tenantId: string
  serviceId: string
  planId: string
  operation: string
  parameters: string
  labels: string
  customLabels: ICustomLabels
  type: string
  status: string
  environmentType: string
  landscapeLabel: string
  platformId: string
  createdDate: number
  modifiedDate: number
  state: string
  stateMessage: string
  serviceName: string
  planName: string
  createdBy: string
  modifiedBy: string
}

export interface ICustomLabels {}

export interface ICFRuntime {
  "API Endpoint": string
  "Org ID": string
  "Org Memory Limit": string
  "Org Name": string
}

export default class ProvisioningService {
  // private serviceCredentials:IServiceCredentials;
  // constructor(serviceCredentials:IServiceCredentials) {
  //   this.serviceCredentials = serviceCredentials;
  // }
  private instanceBinding: IProvisioningInstance;
  constructor(instanceBinding: IProvisioningInstance) {
    this.instanceBinding = instanceBinding;
  }

  public autenticate() {
    return executeHttpRequest(
      {
        url: `${this.instanceBinding.credentials.uaa.url}/oauth/token?grant_type=client_credentials`
      },
      {
        method: 'post',
        headers: {
          Authorization: `Basic ${btoa(`${this.instanceBinding.credentials.uaa.clientid}:${this.instanceBinding.credentials.uaa.clientsecret}`)}`
        }
      }
    );
  }
  public async getRuntimes() {
    const token = await this.autenticate();
    const runtimesResponse = await executeHttpRequest({
      url: `${this.instanceBinding.credentials.endpoints.provisioning_service_url}/provisioning/v1/environments`
    }, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${token.data.access_token}`
      }
      
    }).catch(error=>{
      throw `Error fetching runtimes from ${this.instanceBinding.name} - ${this.instanceBinding.subaccount_id}`;
    });
    return runtimesResponse.data as IRuntimes;
  }

  public async getCloudFoundryRuntimeURL(){
    const runtimes = await this.getRuntimes();
    const env = runtimes.environmentInstances.find(env => env.environmentType === "cloudfoundry");
    let labels:ICFRuntime|undefined=undefined;
    if(env?.labels){
      labels = JSON.parse(env?.labels);
    }
    let cfAPI = "";
    if(labels){
      cfAPI = labels["API Endpoint"]||"";
    }
    return cfAPI;
  }

}