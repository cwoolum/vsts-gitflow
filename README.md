# vsts-gitflow
This is a VSTS extension that enables you to provide GitFlow functionality from a manageable dashboard

## Contributing

So you want to help develop this plugin?? Well, you are awesome! Let me help you out. Here are a list of useful commands.

Make sure you have the tfs cli using ```npm install -g tfx-cli```


1. ```npm run build```
    This one is pretty basic. It just compiles all of the TypeScript and packages the extension.

2. ```npm run gallery-publish``` 
    THis one publishes to the VSTS Gallery. I am going to reserve this one for me. It will be called from the CI process so there are no accidental bad deploys to the marketplace. See the next command for testing on your own.

3. ```tfx extension install```
    THis one allows you to deploy to your own VSTS instance for testing. You will need to generate a [PAT](https://www.visualstudio.com/en-us/docs/setup-admin/team-services/use-personal-access-tokens-to-authenticate). use the ```--vsix``` command to specify the vsix pasckage you created using ```npm run build```. WHen it asks for the installation target accounts, make sure you type just the prefix of the account. For example, if your VSTS account is https://foobar.visualstudio.com, you will only need to use foobar.