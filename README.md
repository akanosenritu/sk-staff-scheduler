# Note to myself
This repository contains all codes related to sk-staff-scheduler.

## TODO
* consolidate two azure functions that have similar functions.
* Have a good understanding of `TeamsFx CLI` and ditch the VS Code extension (because I use `Webstorm`).
* Research a way to make the teams tab available to everyone in the organization.

## Projects
### Overview
There are four yarn workspaces and an independent project.
#### yarn workspaces
1. func-backend (public azure functions backend)
2. nextjs (nextjs frontend)
3. shared (shared codes between projects)
4. teams-app/api (azure functions backend for the teams-app)
#### independent (excluded from workspaces)
1. teams-app/tabs

### func-backend
This is a basic azure functions app hosted at https://func-sk-staff-scheduler.azurewebsites.net. 
List of environment variables that need to be defined to run is available in the `environmentVaribales.ts`.
Because of the yarn workspace configuration and the shared code (`shared` project), the usual method of building is not available.
Instead, it uses webpack to build and incorporate the required node-modules. The config is `webpack.config.js`.

#### To deploy
Run `yarn workspace func-backend deploy` in the project root.
### nextjs
This is a basic nextjs app hosted at https://sk-staff-scheduler.vercel.app/.
This nextjs app currently provides an overview of the schedules submitted.
It uses next-auth and Azure Active Directory to handle authentication.

#### To deploy
Run `vercel` or `vercel --prod` (if you want to make a production deployment) in the project root.
### shared
This project holds the shared code between workspaces.

### teams-app/api
This is an Azure Functions app that was created with VS Code's Teams-Toolkit, therefore it is separate from `func-backend` although they provide very similar functions.
#### To deploy
In the teams-toolkit tab of VS Code with teams-toolkit installed and `teams-app` folder opened, click `Deploy to the crowd` and select `Azure Functions`.

### teams-app/tabs
This is a teams app that provides a custom tab.
#### To deploy
In the teams-toolkit tab of VS Code with teams-toolkit installed and `teams-app` folder opened, click `Deploy to the crowd` and select `Tab Front-End`.
#### Problems
* Apparently to make this tab available in a group, the zip file that contains the tab app must be manually uploaded to the group.  
 
There must be a better way to handle these deployments (with `TeamsFx CLI` probably) but currently I don't have a good understanding of it.
