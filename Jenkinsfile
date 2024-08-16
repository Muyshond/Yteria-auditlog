@Library('pipeline-shared@feature/declarative') _
    
job (
    type: 'sap',
    gitUrl: 'https://bitbucket.org/belgiantrain/central-audit-logs.git',
    bictcode : 'BICT3522',
    mbtVersion: '11-18',
    sonarProjectKey : "BICT3522.Central-Audit-Logs",
    publish: 'azure',
    projectToPublish: 'archive',
    azureDevopsProjectName: 'SAP-BTP',
    branchedSetup: true,
    azReleaseID: ['develop': 4, 'release': 4],
    version: "1.0.$BUILD_NUMBER"
    )