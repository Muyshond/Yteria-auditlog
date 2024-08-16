using CatalogService as service from '../../srv/cat-service';
annotate service.Logs with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'uuid',
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
                Label : 'region',
                Value : region,
            },
            {
                $Type : 'UI.DataField',
                Label : 'time',
                Value : time,
            },
            {
                $Type : 'UI.DataField',
                Label : 'tenant',
                Value : tenant,
            },
            {
                $Type : 'UI.DataField',
                Label : 'org_id',
                Value : org_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'space_id',
                Value : space_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'app_or_service_id',
                Value : app_or_service_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'als_service_id',
                Value : als_service_id,
                
            },
            {
            $Type: 'UI.DataFieldWithUrl',
            Url : user,
            Value: user,
            IconUrl: 'sap-icon://customer',
            
            },
            
            {
                $Type : 'UI.DataField',
                Label : 'format_version',
                Value : format_version,
            },
            {
                $Type : 'UI.DataField',
                Label : 'message',
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
            Label : 'subaccountTechnicalName',
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
            Label : 'subaccountTechnicalName',
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
    subaccountTechnicalName @Common.Label : 'subaccountTechnicalName'
};
annotate service.Logs with {
    app_or_service_id @Common.Label : 'app_or_service_id'
};
annotate service.Logs with {
    als_service_id @Common.Label : 'als_service_id'
};
annotate service.Logs with {
    user @Common.Label : 'user'
};
annotate service.Logs with {
    message_uuid @Common.Label : 'message_uuid'
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



