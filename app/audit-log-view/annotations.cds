using CatalogService as service from '../../srv/cat-service';
using from '../logs/annotations';



annotate service.SubAccounts with @(
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'SubAccount',
            ID : 'SubAccount',
            Target : '@UI.FieldGroup#SubAccount',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'custom',
            ID : 'custom',
            Target : '@UI.FieldGroup#custom',
        },
    ],
    UI.FieldGroup #SubAccount : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : subaccountTechnicalName,
                Label : 'subaccountTechnicalName',
            },{
                $Type : 'UI.DataField',
                Value : subaccountDisplayName,
                Label : 'subaccountDisplayName',
            },{
                $Type : 'UI.DataField',
                Value : subaccountSubdomain,
                Label : 'subaccountSubdomain',
            },
            {
                $Type : 'UI.DataField',
                Value : instance_name,
                Label : 'instance_name',
            },
            {
                $Type : 'UI.DataField',
                Value : org_name,
                Label : 'org_name',
            },
            {
                $Type : 'UI.DataField',
                Value : region,
                Label : 'region',
            },
            {
                $Type : 'UI.DataField',
                Value : space_name,
                Label : 'space_name',
            },
            {
                $Type : 'UI.DataField',
                Value : status,
                Label : 'status',
            },
            {
                $Type : 'UI.DataField',
                Value : type,
                Label : 'type',
            },],
    }
);
annotate service.SubAccounts with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : subaccountDisplayName,
            Label : 'subaccountDisplayName',
        },
        {
            $Type : 'UI.DataField',
            Value : subaccountSubdomain,
            Label : 'subaccountSubdomain',
        },
        {
            $Type : 'UI.DataField',
            Value : subaccountTechnicalName,
            Label : 'subaccountTechnicalName',
        },
    ]
);
annotate service.Logs with @(
    
    UI.SelectionFields : [
        message_uuid,
        timeFrom,
        timeTo,
        subaccountTechnicalName,
        status,
        user,
        app_or_service_id,
        als_service_id,
        category,
        ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'message_uuid',
            Value : message_uuid,
        },
        {
            $Type : 'UI.DataField',
            Label : 'subaccountDisplayName',
            Value : subaccountDisplayName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'subaccountTechnicalName',
            Value : subaccountTechnicalName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'subaccountSubdomain',
            Value : subaccountSubdomain,
        },
        {
            $Type : 'UI.DataField',
            Label : 'region',
            Value : region,
        },
        {
            $Type : 'UI.DataField',
            Value : time,
            
            
        },
    ],
    Analytics.AggregatedProperty #message_uuid_countdistinct : {
        $Type : 'Analytics.AggregatedPropertyType',
        Name : 'message_uuid_countdistinct',
        AggregatableProperty : message_uuid,
        AggregationMethod : 'countdistinct',
        ![@Common.Label] : 'message_uuid (Count Distinct Values)',
    },
    UI.Chart #alpChart : {
        $Type : 'UI.ChartDefinitionType',
        ChartType : #Column,
        Dimensions : [
            category,
        ],
        DynamicMeasures : [
            '@Analytics.AggregatedProperty#message_uuid_countdistinct',
        ],
    },
    UI.Identification : [
        
    ],
    );

annotate service.Logs with @(
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'SubAccount',
            ID : 'SubAccount',
            Target : '@UI.FieldGroup#SubAccount',
        },]);
annotate service.SubAccounts with @(
    UI.FieldGroup #custom : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    }
);
annotate service.Logs with {
    time @Common.Label : 'time'
    @Consumption.filter.selectionType: #INTERVAL
    
};

annotate service.Logs with {
    status @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'DistinctFilterValues',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status,
                    ValueListProperty : 'status',
                },
            ],
        },
        Common.ValueListWithFixedValues : true
)};
annotate service.Logs with @(
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View 1',
    }
);
annotate service.SubAccounts with @(
    UI.LineItem #tableView1 : [
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View SubAccounts 1',
    }
);
annotate service.Logs with @(
    UI.FieldGroup #SubAccount : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : subaccountDisplayName,
                Label : 'subaccountDisplayName',
            },
            {
                $Type : 'UI.DataField',
                Value : subaccountTechnicalName,
            },
            {
                $Type : 'UI.DataField',
                Value : subaccountSubdomain,
                Label : 'subaccountSubdomain',
            },
            {
                $Type : 'UI.DataField',
                Value : instance_name,
                Label : 'instance_name',
            },{
                $Type : 'UI.DataField',
                Value : instance_id,
                Label : 'instance_id',
            },{
                $Type : 'UI.DataField',
                Value : landscape_label,
                Label : 'landscape_label',
            },{
                $Type : 'UI.DataField',
                Value : org_name,
                Label : 'org_name',
            },
            ],
    }
);
annotate service.Logs with @(
    Capabilities.SearchRestrictions : {Searchable : false},
    UI.HeaderInfo : {
        TypeName : '',
        TypeNamePlural : '',
        Description : {
            $Type : 'UI.DataField',
            Value : '',
        },
        Title : {
            $Type : 'UI.DataField',
            Value :  'AuditLog Details',
        },
        
    }
);
annotate service.Logs with {
    subaccountDisplayName @Common.Label : 'subaccountDisplayName'
};
annotate service.Logs with {
    category @Common.Label : 'category'
};
annotate service.Logs with {
    timeFrom @Common.Label : 'time from'
};


annotate service.Logs with {
    timeTo @Common.Label : 'time to'
};
annotate service.Logs with {
    timeForChart @Common.Label : 'time'
};

