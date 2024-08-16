import BaseService from "../../core/BaseService";
import BaseHandler from "../../core/BaseHandler";
import BTPService, { ISubAccount } from "../../service/BTPService";
import cds, { Service } from "@sap/cds";
import AuditLogService, { IAuditLogs } from "../../service/AuditLogService";


export default class DistinctFilterValues extends BaseHandler {

    constructor(srv: Service) {
        super(srv, [{ event: 'on', type: 'READ' }]);
    }

    public async onRead(req: any, next: any, skip: number, top: number) {
        
    
        return [
            { category: 'audit.security-events', status: 'status1' },
            { category: 'audit.configuration', status: 'status2'},
            { category: 'audit.data-modification', status: 'status3' }];
    }
}