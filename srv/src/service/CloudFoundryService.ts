import { executeHttpRequest } from "@sap-cloud-sdk/http-client";
import BaseService from "../core/BaseService";
import { IServiceInstance } from "./ServiceManagerService";
import { getDestination } from "@sap-cloud-sdk/connectivity";

export interface ICFServiceInstance {
  id: string;
  links: {
    details: {
      href: string;
    }
  }
}
export interface ICFServiceInstances {
  resources: Array<ICFServiceInstance>
}
export interface IServiceCredentials {
  credentials: {
    vendor: string,
    url: string,
    uaa: {
      tenantmode: string,
      sburl: string,
      subaccountid: string,
      credentialtype: string,
      clientid: string,
      xsappname: string,
      clientsecret: string,
      serviceInstanceId: string,
      url: string,
      uaadomain: string,
      verificationkey: string,
      apiurl: string,
      identityzone: string,
      identityzoneid: string,
      tenantid: string,
      zoneid: string,
    }
  }
};

export default class CloudFoundryService {
  private subRegionMapping = { "eu10": "004", "eu20": "001" };
  private region: string;
  private subRegion: string;
  private api:string;
  constructor(api: string) {
    // this.region = region;

    // type regionKeys = keyof typeof this.subRegionMapping;
    // this.subRegion = this.subRegionMapping[region as regionKeys];
    this.api = api;
  }

  private async autenticate() {
    const dest = await getDestination({destinationName:"BTP_TECH_USER"});
    //https://uaa.cf.eu20-001.hana.ondemand.com/oauth/token
    return executeHttpRequest(
      {
        // url: `https://uaa.cf.${this.region}-${this.subRegion}.hana.ondemand.com/oauth/token?grant_type=password`
        url: `${this.api.replace("api.cf","uaa.cf")}/oauth/token?grant_type=password`
      },
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`cf:`)}`,
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          "username": dest?.username,
          "password": dest?.password
        }
      }
    ).catch(error=>{
      error?.message && console.error(error.message);
      error?.response?.data?.errors && console.error(error.response.data.errors);
      throw `Error when authenticating to CF ${this.api}`;
    });
  }
  private getServiceOfferings(token: string) {
    return executeHttpRequest(
      {
        // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/service_offerings?names=auditlog-management`
        url: `${this.api}/v3/service_offerings?names=auditlog-management`
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  private getServicePlans(token: string) {
    return executeHttpRequest(
      {
        // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/service_plans?service_offering_names=auditlog-management&names=default`
        url: `${this.api}/v3/service_plans?service_offering_names=auditlog-management&names=default`
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  private getServicePlanForCatalog(token: string, catalog_id: string) {
    return executeHttpRequest(
      {
        // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/service_plans?service_offering_names=auditlog-management&names=default&broker_catalog_ids=${catalog_id}`
        url: `${this.api}/v3/service_plans?service_offering_names=auditlog-management&names=default&broker_catalog_ids=${catalog_id}`
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  private getOrganization(token: string, subdomain: string) {
    return executeHttpRequest(
      {
        // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/organizations?names=${subdomain}`
        url: `${this.api}/v3/organizations?names=${subdomain}`
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  private getSpace(token: string, org: string) {
    return executeHttpRequest(
      {
        // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/spaces?organization_guids=${org}&names=TECH`
        url: `${this.api}/v3/spaces?organization_guids=${org}&names=TECH`
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  private createInstance(token: string, space: string, servicePlan: string,name:string) {
    return executeHttpRequest({
      // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/service_instances`
      url: `${this.api}/v3/service_instances`
    }, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        "type": "managed",
        "name": name,//"auditlog-management-service",
        "relationships": {
          "space": {
            "data": {
              "guid": space
            }
          },
          "service_plan": {
            "data": {
              "guid": servicePlan
            }
          }
        }
      }
    }).catch(error=>{
      error?.message && console.error(error.message);
      error?.response?.data?.errors && console.error(error.response.data.errors);
      throw `Error when creating service instance audit log to CF ${this.api}`;
    });;
  }
  private createInstanceCredentialBindings(token: string, instance: string) {
    return executeHttpRequest({
      // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/service_credential_bindings`
      url: `${this.api}/v3/service_credential_bindings`
    }, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        "type": "key",
        "name": "audit-log-management-service-key",
        "relationships": {
          "service_instance": {
            "data": {
              "guid": instance
            }
          }
        }
      }
    });
  }
  private getCredentials(token: string, credentialsURL: string) {
    return executeHttpRequest(
      {
        url: credentialsURL
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  private checkJob(token: string, joburl: string) {
    return executeHttpRequest(
      {
        url: joburl
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  public async createServiceInstance(catalog_id: string, subdomain: string,name:string) {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    const token = await this.autenticate();
    //get cf org
    //https://api.cf.eu20-001.hana.ondemand.com/v3/organizations?names=b-fdn-dev
    //get cf space
    //https://api.cf.eu20-001.hana.ondemand.com/v3/spaces?organization_guids=7a7520e4-7ead-415d-b058-9be0eec21653&names=TECH
    //adhv space volgende:
    const plan = await this.getServicePlanForCatalog(token.data.access_token, catalog_id);
    if (!plan.data.resources || plan.data.resources.length === 0) {
      throw `Service CF plan not found for BTP catalog id ${catalog_id}`;
    }
    const org = await this.getOrganization(token.data.access_token, subdomain);
    if (!org.data.resources || org.data.resources.length === 0) {
      throw `Org CF not found for BTP subdomain ${subdomain}`;
    }
    const space = await this.getSpace(token.data.access_token, org.data.resources[0].guid);
    if (!space.data.resources || space.data.resources.length === 0) {
      throw `Space CF not found for BTP org ${org.data.resources[0].name}`;
    }
    const instance = await this.createInstance(token.data.access_token, space.data.resources[0].guid, plan.data.resources[0].guid,name);
    if (!instance.headers.location) {
      throw `Space CF could not be created for BTP org ${org.data.resources[0].name}`;
    }
    let jobResult;
    do {
      await sleep(1000);
      jobResult = await this.checkJob(token.data.access_token, instance.headers.location);
    } while (jobResult.data.state !== 'COMPLETE');
    const instanceParts = jobResult.data?.links?.service_instances?.href?.split("/");
    const instanceid = instanceParts[instanceParts.length - 1];
    const credential = await this.createInstanceCredentialBindings(token.data.access_token, instanceid);//instance.data.guid);
    if (!credential.headers.location) {
      throw `Credentials CF could not be created for BTP space ${instanceid}`;
    }
    do {
      await sleep(1000);
      jobResult = await this.checkJob(token.data.access_token, credential.headers.location);
    } while (jobResult.data.state !== 'COMPLETE');
    return instanceid;
    // return this.getCredentials(token.data.access_token,jobResult.data?.links?.service_credential_binding?.href);
  }
  private getServiceInstanceByPlan(token: string, planid: string) {
    return executeHttpRequest(
      {
        // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/service_instances?service_plan_guids=${planid}`
        url: `${this.api}/v3/service_instances?service_plan_guids=${planid}`
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
  private getServiceInstanceByService(token: string, service: IServiceInstance) {
    return executeHttpRequest(
      {
        // url: `https://api.cf.${this.region}-${this.subRegion}.hana.ondemand.com/v3/service_credential_bindings?service_instance_guids=${service.id}`
        url: `${this.api}/v3/service_credential_bindings?service_instance_guids=${service.id}`
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  public async getServiceInstanceCredentialsByID(service: IServiceInstance) {
    const token = await this.autenticate();
    // const offering = await this.getServiceOfferings(token.data.access_token);
    // const plan = await this.getServicePlans(token.data.access_token);
    // let instance;
    // if (plan?.data?.resources?.length > 0) {
    const instance = await this.getServiceInstanceByService(token.data.access_token, service);
    // }
    // if (instance?.data) {
    if (instance?.data?.resources?.length > 0) {
      return (await this.getCredentials(token.data.access_token, (instance.data as ICFServiceInstances).resources[0].links.details.href)).data;
    }
    const credentials = await this.createInstanceCredentialBindings(token.data.access_token, service.id);
    if (!credentials.data) {
      throw `Credentials CF could not be created for BTP space ${instance.data.guid}`;
    }
    return (await this.getCredentials(token.data.access_token, (instance.data as ICFServiceInstances).resources[0].links.details.href)).data
  }

}