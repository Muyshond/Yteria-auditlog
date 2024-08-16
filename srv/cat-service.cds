@impl: './src/service'
service CatalogService  @(requires: 'authenticated-user' ) {
    @readonly  @cds.persistence.skip 
    entity Logs {
        key message_uuid:String;
        key subaccountTechnicalName:String;
        key time: Timestamp;//DateTime; => anders wordt time niet gedisplayed
        subaccountDisplayName:String;
        subaccountSubdomain:String;
        region:String;
        tenant:String;
        org_id:String;
        space_id:String;
        app_or_service_id:String;
        als_service_id:String;
        user:String;
        category: String;
        format_version:String;
        message:String;
        status:String;
        org_name:String;
        landscape_label:String;
        instance_name:String;
        instance_id:String;
        //Time filters werken niet dus alternatief
        timeFrom:Timestamp;
        timeTo: Timestamp; 
        timeForChart:Date;
        //subaccount: Composition of one SubAccounts on subaccountTechnicalName = subaccount.subaccountTechnicalName;

    };

    //action sendmail (log: Logs);

    @readonly  @cds.persistence.skip
    entity SubAccounts {
        key subaccountTechnicalName:String;
        subaccountDisplayName:String;
        subaccountSubdomain:String;
        type:String; // CF or NEO
        org_id:String;
        org_name:String;
        space_id:String;
        space_name:String;
        instance_id:String;
        instance_name:String;
        landscape_label:String;
        region:String;
        status:String;
        //logs: Composition of many Logs on logs.subaccountTechnicalName = subaccountTechnicalName;
    };

    @readonly @cds.persistence.skip
    entity DistinctFilterValues {
        key category: String;
        key status: String;
    }
    
}

annotate CatalogService.Logs with @Aggregation.ApplySupported: {
    Transformations       : [],
  Rollup                : #None,
  PropertyRestrictions  : true,
  GroupableProperties   : [
    category,
    timeForChart,
    message_uuid
  ],
  AggregatableProperties: [
    {Property: message_uuid, 
     },{
        Property: timeForChart
     },{
        Property: category
     }
  ],
};