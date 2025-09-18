import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class KavenegarApi implements ICredentialType {
  name = 'kavenegarApi';
  displayName = 'Kavenegar API';
  documentationUrl = 'https://kavenegar.com/rest.html';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      description: 'Your Kavenegar API key',
      required: true,
    },
  ];
}
