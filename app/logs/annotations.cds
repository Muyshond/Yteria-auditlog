using CatalogService as service from '../../srv/cat-service';
annotate service.Logs with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Message UUID',
                Value : message_uuid,
            },
            {
            $Type : 'UI.DataField',
            Criticality : 2,
            Value : category,
            ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Label : 'Region',
                Value : region,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Time',
                Value : time,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Tenant',
                Value : tenant,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Org ID',
                Value : org_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Space ID',
                Value : space_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'App/Service ID',
                Value : app_or_service_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Als Service ID',
                Value : als_service_id,
                
            },
            {
            $Type: 'UI.DataField',
            Value: user,
            IconUrl: 'sap-icon://customer',
            
            },
            
            {
                $Type : 'UI.DataField',
                Label : 'Format Version',
                Value : format_version,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Message',
                Value : message,
            },
            /*{
                $Type : 'UI.DataField',
                Label : 'status',
                Value : status,
            }*/
            
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Auditlog',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
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
    ]
);


annotate service.Logs with @(
    UI.SelectionPresentationVariant #tableView : {
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
        Text : '{i18n>Auditlogs}',
    }
);
annotate service.SubAccounts with @(
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : subaccountTechnicalName,
            Label : 'Subaccount Technical Name',
        },],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View SubAccounts',
    }
);
annotate service.SubAccounts with @(
    UI.LineItem #tableView3 : [
        {
            $Type : 'UI.DataField',
            Value : subaccountTechnicalName,
            Label : 'Subaccount Technical Name',
        },],
    UI.SelectionPresentationVariant #tableView3 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView3',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
            ],
        },
        Text : 'Table View SubAccounts 3',
    }
);

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
)};
annotate service.Logs with {
    subaccountTechnicalName @Common.Label : 'Subaccount Technical Name'
};
annotate service.Logs with {
    app_or_service_id @Common.Label : 'App/Service ID'
};
annotate service.Logs with {
    als_service_id @Common.Label : 'Als Service ID'
};
annotate service.Logs with {
    user @Common.Label : 'User'
};
annotate service.Logs with {
    message_uuid @Common.Label : 'Message UUID'
};
annotate service.Logs with {
    category @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'DistinctFilterValues',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : category,
                    ValueListProperty : 'category',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
)};



