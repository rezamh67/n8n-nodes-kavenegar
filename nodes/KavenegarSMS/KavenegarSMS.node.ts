import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class KavenegarSMS implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kavenegar SMS',
		name: 'kavenegarSms',
		icon: 'file:kavenegar.svg',
		group: ['output'],
		version: 1,
		description: 'Send an SMS through Kavenegar API',
		defaults: {
			name: 'Kavenegar SMS',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
      {
        name: 'kavenegarApi',
        required: true,
      },
    ],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Send SMS',
						value: 'sendSms',
						description: 'Send an SMS',
						action: 'Send an SMS',
					},
					{
						name: 'Otp Verification',
						value: 'otpVerification',
						description: 'Verify an OTP',
						action: 'Verify an OTP',
					},
					{
						name: 'TTS',
						value: 'tts',
						description: 'Send a TTS',
						action: 'Send a TTS',
					},
				],
				default: 'sendSms',
			},
			{
				displayName: 'Receptor',
				name: 'receptor',
				type: 'string',
				default: '',
				required: true,
				description: 'The receptor of the SMS',
			},
			{
				displayName: 'Sender',
				name: 'sender',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendSms'],
					},
				},
				description: 'The sender of the SMS',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendSms'],
					},
				},
				description: 'The message of the SMS',
			},
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['otpVerification'],
					},
				},
				description: 'The OTP token to verify',
			},
			{
				displayName: 'Token 2',
				name: 'token2',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['otpVerification'],
					},
				},
				description: 'The OTP token to verify 2',
			},
			{
				displayName: 'Token 3',
				name: 'token3',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['otpVerification'],
					},
				},
				description: 'The OTP token to verify 3',
			},
			{
				displayName: 'Template',
				name: 'template',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['otpVerification'],
					},
				},
				description: 'The template name for OTP verification',
			},
			{
				displayName: 'TTS Message',
				name: 'ttsMessage',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['tts'],
					},
				},
				description: 'The message for TTS',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let receptor: string;
		let sender: string;
		let message: string;
		let token: string;
		let token2: string;
		let token3: string;
		let template: string;
		let ttsMessage: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const credentials = await this.getCredentials('kavenegarApi');
				const operation = this.getNodeParameter('operation', itemIndex, 'sendSms') as string;
				receptor = this.getNodeParameter('receptor', itemIndex, '') as string;
				item = items[itemIndex];

				if (!credentials) {
					throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
				}
				const apiKey = credentials.apiKey as string;

				let url: string;
				let response: any;

				if (operation === 'sendSms') {
					sender = this.getNodeParameter('sender', itemIndex, '') as string;
					message = this.getNodeParameter('message', itemIndex, '') as string;

					url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${encodeURIComponent(receptor)}&sender=${encodeURIComponent(sender)}&message=${encodeURIComponent(message)}`;

					response = await this.helpers.requestWithAuthentication.call(
						this,
						'kavenegarApi',
						{
							method: 'GET',
							url,
							json: true,
						},
					);

					item.json.response = response;
					item.json.sent = true;
					item.json.receptor = receptor;
					item.json.sender = sender;
					item.json.message = message;

				} else if (operation === 'otpVerification') {
					token = this.getNodeParameter('token', itemIndex, '') as string;
					token2 = this.getNodeParameter('token2', itemIndex, '') as string;
					token3 = this.getNodeParameter('token3', itemIndex, '') as string;
					template = this.getNodeParameter('template', itemIndex, '') as string;

					url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${encodeURIComponent(receptor)}&token=${encodeURIComponent(token)}&template=${encodeURIComponent(template)}`;

					if (token2 && token2.trim() !== '') {
						url += `&token2=${encodeURIComponent(token2)}`;
					}

					if (token3 && token3.trim() !== '') {
						url += `&token3=${encodeURIComponent(token3)}`;
					}

					response = await this.helpers.requestWithAuthentication.call(
						this,
						'kavenegarApi',
						{
							method: 'GET',
							url,
							json: true,
						},
					);

					item.json.response = response;
					item.json.verified = true;
					item.json.receptor = receptor;
					item.json.token = token;
					item.json.template = template;

					if (token2 && token2.trim() !== '') {
						item.json.token2 = token2;
					}
					if (token3 && token3.trim() !== '') {
						item.json.token3 = token3;
					}
				} else if (operation === 'tts') {
					ttsMessage = this.getNodeParameter('ttsMessage', itemIndex, '') as string;

					url = `https://api.kavenegar.com/v1/${apiKey}/call/maketts.json?receptor=${encodeURIComponent(receptor)}&message=${encodeURIComponent(ttsMessage)}`;

					response = await this.helpers.requestWithAuthentication.call(
						this,
						'kavenegarApi',
						{
							method: 'GET',
							url,
							json: true,
						},
					);

					item.json.response = response;
					item.json.tts = true;
					item.json.receptor = receptor;
					item.json.ttsMessage = ttsMessage;
				}

			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
