import {
  IPollFunctions,
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  NodeConnectionType,
  NodeOperationError,
} from 'n8n-workflow';

export class KavenegarTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kavenegar SMS Trigger',
    name: 'kavenegarTrigger',
    icon: 'file:kavenegar.svg',
    group: ['trigger'],
    version: 1,
    description: 'Triggers when an SMS is received via Kavenegar',
    defaults: {
      name: 'Kavenegar SMS Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'kavenegarApi',
        required: true,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Line Number',
        name: 'lineNumber',
        type: 'string',
        default: '',
        required: true,
        placeholder: '',
        description: 'The Kavenegar line number to check for incoming SMS',
      },
      {
        displayName: 'Poll Interval (Seconds)',
        name: 'pollInterval',
        type: 'number',
        default: 30,
        description: 'How often to check for new SMS (in seconds)',
      },
      {
        displayName: 'Sender Filter',
        name: 'senderFilter',
        type: 'string',
        default: '',
        placeholder: '09123456789',
        description: 'Only trigger for SMS from this phone number. Leave empty to trigger for SMS from any sender.',
      },
      {
        displayName: 'Message Contains',
        name: 'messageFilter',
        type: 'string',
        default: '',
        description: 'Only trigger when message contains this text. Leave empty to trigger for all messages.',
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    const credentials = await this.getCredentials('kavenegarApi');

    if (!credentials) {
      throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
    }

    const apiKey = credentials.apiKey as string;
    const lineNumber = this.getNodeParameter('lineNumber') as string;
    const senderFilter = this.getNodeParameter('senderFilter') as string;
    const messageFilter = this.getNodeParameter('messageFilter') as string;

    // ساخت URL برای دریافت SMS
    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/receive.json?linenumber=${encodeURIComponent(lineNumber)}&isread=0`;

    try {
      // درخواست به API کاوه‌نگار
      const response = await this.helpers.requestWithAuthentication.call(
        this,
        'kavenegarApi',
        {
          method: 'GET',
          url,
          json: true,
        },
      );

      const items: INodeExecutionData[] = [];

      // بررسی پاسخ API
      if (response && response.return && response.return.status === 200 && response.entries) {
        for (const entry of response.entries) {
          const sender = entry.sender;
          const message = entry.message;
          const messageId = entry.messageid;
          const date = entry.date;

          // اعمال فیلترها
          let shouldTrigger = true;

          // فیلتر فرستنده
          if (senderFilter && sender && !sender.includes(senderFilter)) {
            shouldTrigger = false;
          }

          // فیلتر متن پیام
          if (messageFilter && message && !message.toLowerCase().includes(messageFilter.toLowerCase())) {
            shouldTrigger = false;
          }

          if (shouldTrigger) {
            items.push({
              json: {
                sender,
                message,
                messageId,
                date,
                lineNumber,
                rawData: entry,
                timestamp: new Date().toISOString(),
              },
            });
          }
        }
      }

      return items.length > 0 ? [items] : null;

    } catch (error) {
      throw new NodeOperationError(this.getNode(), `Error fetching SMS: ${error.message}`);
    }
  }
}
