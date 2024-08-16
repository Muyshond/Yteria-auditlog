import BaseService from "../../core/BaseService";
import BaseHandler from "../../core/BaseHandler";
import BTPService, { ISubAccount } from "../../service/BTPService";
import cds, { Service } from "@sap/cds";
import AuditLogService, { IAuditLogs } from "../../service/AuditLogService";

export default class LogsHandler extends BaseHandler {
    private btpService!: BTPService;
    private subaccountBindings: Array<ISubAccount>;

    constructor(srv: any) {
        super(srv, [{ event: 'on', type: 'READ' }]);
        BaseService.getInstance(BTPService)
            .then((btpService) => btpService.getAllServiceManagementBindings())
            .then(subaccountBindings => {
                this.subaccountBindings = subaccountBindings;
            });
        //@ts-ignore
        cds.spawn({ every: 3600000 }, async (tx) => {
            this.btpService = await BaseService.getInstance(BTPService);
            this.subaccountBindings = await this.btpService.getAllServiceManagementBindings();
        })
    }
    
    protected async onRead(req: any, next: any, skip: number, top: number) {
        if (!this.subaccountBindings) {
            this.btpService = await BaseService.getInstance(BTPService);
            this.subaccountBindings = await this.btpService.getAllServiceManagementBindings();
        }
        // const timeIdx = req.query.SELECT.where.findIndex((cond:string)=>(cond?.ref && cond?.ref.length > 0 && cond?.ref[0]==="time"));
        // const timeFromIdx = req.query.SELECT.where.findIndex((cond:string)=>(cond===">"));
        // const timeToIdx = req.query.SELECT.where.findIndex((cond:string)=>(cond==="<"));
        // if(timeFromIdx > -1 && req.query.SELECT.where[timeFromIdx-1]?.ref?.length > 0 && req.query.SELECT.where[timeFromIdx-1]?.ref[0]==="time" )
        // // if(req.query.SELECT.where[timeIdx-1]===">"){
        //     time_from = (req.query.SELECT.where[timeFromIdx+1] as {val:string}).val.split(".")[0];
        // })
        // const time_from = this.getTimeParam(">", req.query.SELECT.where) || this.getTimeParam(">=", req.query.SELECT.where);
        // const time_to = this.getTimeParam("<", req.query.SELECT.where) || this.getTimeParam("<=", req.query.SELECT.where);
        let {timeFrom,timeTo,subaccountTechnicalName, message_uuid, app_or_service_id, als_service_id, user, status, category} = this.getTimeParams(req.query.SELECT.where);
        let time:string="";
        if(Object.keys(req.data).length !== 0){
            ({message_uuid,subaccountTechnicalName,time} = req.data);
            
            timeFrom = new Date((new Date(time).getTime() - 1000));
            timeTo = new Date((new Date(time).getTime() + 1000));
            
        }
        console.log(`Start getting audit logs for time from ${timeFrom} to ${timeTo} for subaccount ${subaccountTechnicalName}`)

        const auditlogsResponse = await Promise.all(this.subaccountBindings
            .filter(subaccount => !subaccount.status && ( ( subaccountTechnicalName && subaccount.technicalName === subaccountTechnicalName ) || !subaccountTechnicalName ) ) //only continue when it has no error in status
            .map(subaccount => (new AuditLogService(subaccount)).getBTPAuditLogs({ timeFrom, timeTo })));
        let fullLogs: IAuditLogs[] = [];

        for (let logs of auditlogsResponse) {
            
            logs = logs.map(log => {
                log.timeForChart = log.time; 

                const date = typeof log.time === 'string' ? new Date(log.time) : log.time;
                //log.time = new Date(log.time);
                log.time = new Date (date);
                //log.time = new Date (date.toISOString() + "Z");
                
                return log;
            });
            
            try{

            if (!!message_uuid) {
                logs = logs.filter(log=>log.message_uuid == message_uuid);
            }
            if (!!app_or_service_id) {
                logs = logs.filter(log=>log.app_or_service_id === app_or_service_id);
            }
            if (!!als_service_id) {
                logs = logs.filter(log=>log.als_service_id === als_service_id);
            }
            if (!!user) {
                logs = logs.filter(log=>log.user == user);
            }
            if (!!status) {
                logs = logs.filter(log=>log.status === status);
            }
            if (!!category) {
                logs = logs.filter(log=>log.category === category);
            }
        }catch(error){
            console.log(error);
        }
            fullLogs = [...fullLogs, ...logs];
        }
        
        //@ts-ignore
        if (req.query.SELECT.count) fullLogs['$count'] = fullLogs.length;
        return fullLogs;
    }

    private getTimeParams(where: any) {
        // const timeIdx = where?.findIndex((cond: string) => (cond === findCond)) || -1;
        // if (timeIdx > -1 && where[timeIdx - 1]?.ref?.length > 0 && where[timeIdx - 1]?.ref[0] === "time") {
        //     // if(req.query.SELECT.where[timeIdx-1]===">"){
        //     return (where[timeIdx + 1] as { val: string }).val.split(".")[0];
        // }
        let timeFrom, timeTo, subaccountTechnicalName, message_uuid, app_or_service_id, als_service_id, user, status, category;

    try{
        for (let i = 0; i < (where?.length ||0); i += 4) {
            // i+=4 because we know there's always <operand> <operator> <operand> [ <and/or> ... ]
            let [a, op, b] = where.slice(i)
            // destructure the next <operand> <operator> <operand> of the where clause
            //vervangen door TimeTo en TimeFrom
            /*
            if (a.ref[0] === 'time') {
                // only consider comparisons with time
                if (op === '>' || op === '>=') timeFrom  = b.val.split(".")[0];//.slice(0, 19)
                // assumed this is a date ISO string
                if (op === '<' || op === '<=') timeTo = b.val.split(".")[0];//.slice(0, 19)
                // assumed this is a date ISO string
            }*/
            if (a.ref[0] === 'subaccountTechnicalName')subaccountTechnicalName  = b.val;
            if (a.ref[0] === 'message_uuid')message_uuid  = b.val;
            if (a.ref[0] === 'app_or_service_id')app_or_service_id  = b.val;
            if (a.ref[0] === 'als_service_id')als_service_id  = b.val;
            if (a.ref[0] === 'user')user  = b.val;
            if (a.ref[0] === 'status')status  = b.val;
            if (a.ref[0] === 'category')category  = b.val;

            if (a.ref[0] === 'timeFrom')timeFrom  = b.val;
            if (a.ref[0] === 'timeTo')timeTo  = b.val;
        }
    } catch (error){
        console.log(error);
    }
        return {timeFrom,timeTo,subaccountTechnicalName, message_uuid, app_or_service_id, als_service_id, user, status, category};

            
    }
}