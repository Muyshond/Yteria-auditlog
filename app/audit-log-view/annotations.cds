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
                Label : 'Subaccount Technical Name',
            },{
                $Type : 'UI.DataField',
                Value : subaccountDisplayName,
                Label : 'Subaccount Display Name',
            },{
                $Type : 'UI.DataField',
                Value : subaccountSubdomain,
                Label : 'Subaccount Subdomain',
            },
            {
                $Type : 'UI.DataField',
                Value : instance_name,
                Label : 'Instance Name',
            },
            {
                $Type : 'UI.DataField',
                Value : org_name,
                Label : 'Org Name',
            },
            {
                $Type : 'UI.DataField',
                Value : region,
                Label : 'Region',
            },
            {
                $Type : 'UI.DataField',
                Value : space_name,
                Label : 'Space Name',
            },
            {
                $Type : 'UI.DataField',
                Value : status,
                Label : 'Status',
            },
            {
                $Type : 'UI.DataField',
                Value : type,
                Label : 'Type',
            },],
    }
);
annotate service.SubAccounts with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : subaccountDisplayName,
            Label : 'Subaccount Display Name',
        },
        {
            $Type : 'UI.DataField',
            Value : subaccountSubdomain,
            Label : 'Subaccount Subdomain',
        },
        {
            $Type : 'UI.DataField',
            Value : subaccountTechnicalName,
            Label : 'Subaccount Technical Name',
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
    Capabilities : {
    FilterRestrictions : {
        $Type              : 'Capabilities.FilterRestrictionsType',
        RequiredProperties : [
            timeFrom,
            timeTo
        ],
    }
},
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Message UUID',
            Value : message_uuid,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Subaccount Display Name',
            Value : subaccountDisplayName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Subaccount Technical Name',
            Value : subaccountTechnicalName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Subaccount Subdomain',
            Value : subaccountSubdomain,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Region',
            Value : region,
        },
        {
            $Type : 'UI.DataField',
            Value : time,
            Label: 'Time'
            
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
    time @Common.Label : 'Time'
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
        Text : 'Auditlogs',
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
                Label : 'Subaccount Display Name',
            },
            {
                $Type : 'UI.DataField',
                Value : subaccountTechnicalName,
                Label: 'Subaccount Technical Name'
            },
            {
                $Type : 'UI.DataField',
                Value : subaccountSubdomain,
                Label : 'Subaccount Subdomain',
            },
            {
                $Type : 'UI.DataField',
                Value : instance_name,
                Label : 'Instance Name',
            },{
                $Type : 'UI.DataField',
                Value : instance_id,
                Label : 'Instance ID',
            },{
                $Type : 'UI.DataField',
                Value : landscape_label,
                Label : 'Landscape Label',
            },{
                $Type : 'UI.DataField',
                Value : org_name,
                Label : 'Org Name',
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
    subaccountDisplayName @Common.Label : 'Subaccount Display Name'
};
annotate service.Logs with {
    category @Common.Label : 'Category'
};
annotate service.Logs with {
    timeFrom @Common.Label : 'Time From'
};


annotate service.Logs with {
    timeTo @Common.Label : 'Time To'
};
annotate service.Logs with {
    timeForChart @Common.Label : 'Time'
};

