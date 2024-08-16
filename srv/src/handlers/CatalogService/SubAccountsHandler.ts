import BaseService from "../../core/BaseService";
import BaseHandler from "../../core/BaseHandler";
import BTPService, { ISubAccount } from "../../service/BTPService";
import { Service, services } from "@sap/cds";
import { executeHttpRequest } from "@sap-cloud-sdk/http-client";
import ServiceManagerService, { IServiceInstance, IServiceInstances } from "../../service/ServiceManagerService";
import CloudFoundryService, { IServiceCredentials } from "../../service/CloudFoundryService";
import AuditLogService, { IAuditLogs } from "../../service/AuditLogService";

export default class SubAccountsHandler extends BaseHandler {
    private btpService!: BTPService;

    constructor(srv: Service) {
        super(srv, [{ event: 'on', type: 'READ' }]);
    }
    protected async onRead(req: any, next: any, skip: number, top: number) {
        const data = req.data;
        const queyr = req.query;
        this.btpService = await BaseService.getInstance(BTPService);
        //new Date().toISOString().split(".")[0]
        const subaccountBindings = await this.btpService.getAllServiceManagementBindings(data?.subaccountTechnicalName||"");
        
        let fullLogs: IAuditLogs[] = subaccountBindings
        // .filter(subaccount=>subaccount.status)//add subaccounts with error status
        .map(subaccount=>({
            subaccountDisplayName : subaccount.displayName,
            subaccountTechnicalName : subaccount.technicalName,
            subaccountSubdomain : subaccount.subdomain,
            region : subaccount.region,
            status: subaccount.status,
            space_id:subaccount.serviceInstance?.context?.space_guid,
            space_name:subaccount.serviceInstance?.context?.space_name,
            org_id:subaccount.serviceInstance?.context?.organization_guid,
            org_name:subaccount.serviceInstance?.context?.organization_name,
            landscape_label:subaccount.serviceInstance?.context?.landscape_label,
            instance_name:subaccount.serviceInstance?.name,
            instance_id:subaccount.serviceInstance?.id         
        }));
        //@ts-ignore 
        if (req.query.SELECT.count) fullLogs['$count'] = fullLogs.length;
        return fullLogs;
    }
}