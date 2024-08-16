sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/yteria/auditlog/auditlogview/test/integration/FirstJourney',
		'com/yteria/auditlog/auditlogview/test/integration/pages/LogsList',
		'com/yteria/auditlog/auditlogview/test/integration/pages/LogsObjectPage'
    ],
    function(JourneyRunner, opaJourney, LogsList, LogsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/yteria/auditlog/auditlogview') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheLogsList: LogsList,
					onTheLogsObjectPage: LogsObjectPage
                }
            },
            opaJourney.run
        );
    }
);