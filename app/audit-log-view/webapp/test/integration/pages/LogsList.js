sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.yteria.auditlog.auditlogview',
            componentId: 'LogsList',
            contextPath: '/Logs'
        },
        CustomPageDefinitions
    );
});