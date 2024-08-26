import BaseService from "../../core/BaseService";
import BaseHandler from "../../core/BaseHandler";
import BTPService, { ISubAccount } from "../../service/BTPService";
import cds, { Service } from "@sap/cds";
import AuditLogService, { IAuditLogs } from "../../service/AuditLogService";


export default class categoryFilterValuesHandler extends BaseHandler {

    constructor(srv: Service) {
        super(srv, [{ event: 'on', type: 'READ' }]);
    }

    public async onRead(req: any, next: any, skip: number, top: number) {
        
    
        return [
            { category: 'audit.security-events' },
            { category: 'audit.configuration'},
            { category: 'audit.data-modification'}];
    }
}