sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'be/nmbs/logs/test/integration/FirstJourney',
		'be/nmbs/logs/test/integration/pages/LogsList',
		'be/nmbs/logs/test/integration/pages/LogsObjectPage'
    ],
    function(JourneyRunner, opaJourney, LogsList, LogsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('be/nmbs/logs') + '/index.html'
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