import { executeHttpRequest } from "@sap-cloud-sdk/http-client";
import BaseService from "../core/BaseService";
import { IServiceCredentials } from "./CloudFoundryService";
import { ISubAccount } from "./BTPService";

export interface IAuditLogParams {
  timeFrom?: string;
  timeTo?: string;
  handle?: string;
  status?:string;
  message_uuid?:string;
  app_or_service_id?: string;
  als_service_id?: string;
  user?: string;
}
export interface IAuditLogs {
  message_uuid?: string;
  subaccountDisplayName: string;
  subaccountTechnicalName: string;
  subaccountSubdomain: string;
  region: string;
  time?: Date |string;
  tenant?: string;
  org_id?: string;
  space_id?: string;
  app_or_service_id?: string;
  als_service_id?: string;
  user?: string;
  category?: string;
  format_version?: string;
  message?: string;
  status?: string;
//Custom verwijder indien fout
  org_name?:string;
  landscape_label?:string;
  instance_name?:string;
  instance_id?:string;
  //Stop verwijder
  timeForChart?: Date;

}
export default class AuditLogService {
  // private serviceCredentials:IServiceCredentials;
  // constructor(serviceCredentials:IServiceCredentials) {
  //   this.serviceCredentials = serviceCredentials;
  // }
  private subaccount: ISubAccount;
  constructor(subaccount: ISubAccount) {
    this.subaccount = subaccount;
  }

  public autenticate() {
    return executeHttpRequest(
      {
        url: `${this.subaccount?.serviceCredentials?.credentials?.uaa.url}/oauth/token?grant_type=client_credentials`
      },
      {
        method: 'post',
        headers: {
          Authorization: `Basic ${btoa(`${this.subaccount?.serviceCredentials?.credentials?.uaa.clientid}:${this.subaccount?.serviceCredentials?.credentials.uaa.clientsecret}`)}`
        }
      }
    );
  }
  public async getAuditLogs(params: IAuditLogParams | undefined) {
    const token = await this.autenticate();
    let urlParameters = "";
    if (params?.timeTo) {
      urlParameters = `${urlParameters}time_to=${new Date(params.timeTo).toISOString().split(".")[0]}`;
    }
    if (params?.timeFrom) {
      if (urlParameters) {
        urlParameters = `${urlParameters}&`;
      }
      urlParameters = `${urlParameters}time_from=${new Date(params.timeFrom).toISOString().split(".")[0]}`;
    }
    if (params?.handle) {
      if (urlParameters) {
        urlParameters = `${urlParameters}&`;
      }
      urlParameters = `${urlParameters}${params.handle}`;
    }
    return executeHttpRequest(
      {
        url: `${this.subaccount.serviceCredentials?.credentials.url}/auditlog/v2/auditlogrecords?${urlParameters}`
      },
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token.data.access_token}`
        }
      }
    );
  }
  public async getBTPAuditLogs(parameters: IAuditLogParams | undefined) {
    let urlParameters = parameters;
    let allLogs: any[] = [];
    let count = 0;
    do {
      count++;
      console.log(`Start getting audit logs for ${this.subaccount.displayName} Part ${count}`)
      try {
        const logs = await this.getAuditLogs(urlParameters);
        for (let log of logs.data as Array<IAuditLogs>) {
          log.subaccountDisplayName = this.subaccount.displayName;
          log.subaccountTechnicalName = this.subaccount.technicalName;
          log.subaccountSubdomain = this.subaccount.subdomain;
          log.region = this.subaccount.region;
          log.org_name = this.subaccount.serviceInstance?.context?.organization_name;
          log.landscape_label = this.subaccount.serviceInstance?.context?.landscape_label;
          log.instance_name = this.subaccount.serviceInstance?.name;
          log.instance_id = this.subaccount.serviceInstance?.id;
          
        }
        console.log(`Finished getting audit logs for ${this.subaccount.displayName} Part ${count}`)
        allLogs = [...allLogs, ...logs.data];
        urlParameters = { handle: logs.headers.paging };
      } catch (error) {
        console.log(`Error getting audit logs for ${this.subaccount.displayName} Part ${count}`);
        console.error(error);
      }
    } while (urlParameters?.handle && parameters?.timeFrom && parameters?.timeTo);
//Extra filters         //extra toegevoegd verwijder indien niet werk

    if (parameters?.message_uuid) {
      allLogs = allLogs.filter(log => log.message_uuid === parameters.message_uuid);
    }
      //Stop hier

    return allLogs;
  }

}