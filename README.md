# n8n-nodes-kavenegar

[![npm version](https://badge.fury.io/js/n8n-nodes-kavenegar.svg)](https://badge.fury.io/js/n8n-nodes-kavenegar)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive n8n community node package for integrating with [Kavenegar](https://kavenegar.com) SMS services. This package provides both action nodes and trigger nodes to send SMS, handle OTP verification, TTS calls, and receive SMS messages in your n8n workflows.

## Features

### 📤 Kavenegar SMS Node
- **Send SMS**: Send text messages to single or multiple recipients
- **OTP Verification**: Send OTP codes using predefined templates with up to 3 tokens
- **Text-to-Speech (TTS)**: Make TTS calls to phone numbers

### 📥 Kavenegar SMS Trigger Node
- **Receive SMS**: Trigger workflows when SMS messages are received
- **Flexible Filtering**: Filter by sender phone number and message content
- **Polling Support**: Configurable polling intervals for checking new messages

## Installation

### Install from npm

```bash
npm install n8n-nodes-kavenegar
```

### Install in n8n

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-kavenegar`
4. Agree to the risks of using community nodes
5. Select **Install**

After installation restart n8n to see the new nodes.

## Configuration

### Credentials Setup

1. In n8n, go to **Credentials** > **Add Credential**
2. Search for "Kavenegar API"
3. Enter your Kavenegar API key
   - Get your API key from [Kavenegar Panel](https://panel.kavenegar.com/client/setting/account)
4. Save the credentials

### Node Configuration

#### Kavenegar SMS Node

**Send SMS Operation:**
- **Receptor**: Phone number(s) to send SMS to (e.g., "09123456789" or "09123456789,09123456788")
- **Sender**: Your Kavenegar sender number or sender ID
- **Message**: Text message content

**OTP Verification Operation:**
- **Receptor**: Phone number to send OTP to
- **Token**: Primary OTP token/code
- **Token 2** (Optional): Secondary token for multi-parameter templates
- **Token 3** (Optional): Third token for complex templates
- **Template**: Name of your predefined OTP template in Kavenegar panel

**TTS Operation:**
- **Receptor**: Phone number to call
- **TTS Message**: Text message to be converted to speech

#### Kavenegar SMS Trigger Node

- **Line Number**: Your Kavenegar line number for receiving SMS
- **Poll Interval**: How often to check for new messages (in seconds, default: 30)
- **Sender Filter** (Optional): Only trigger for SMS from specific phone number
- **Message Contains** (Optional): Only trigger when message contains specific text

## Usage Examples

### Example 1: Send Welcome SMS

```json
{
  "operation": "sendSms",
  "receptor": "09123456789",
  "sender": "10008663",
  "message": "Welcome to our service! Your account has been created successfully."
}
```

### Example 2: Send OTP Code

```json
{
  "operation": "otpVerification",
  "receptor": "09123456789",
  "token": "123456",
  "template": "verify-code"
}
```

### Example 3: Multi-Token OTP

```json
{
  "operation": "otpVerification",
  "receptor": "09123456789",
  "token": "John",
  "token2": "123456",
  "token3": "5",
  "template": "user-verification"
}
```

### Example 4: TTS Call

```json
{
  "operation": "tts",
  "receptor": "09123456789",
  "ttsMessage": "Hello, this is an automated call from our system."
}
```

## API Response Format

All operations return structured data including:

```json
{
  "response": {
    "return": {
      "status": 200,
      "message": "تایید شد"
    },
    "entries": [...]
  },
  "sent": true,
  "receptor": "09123456789",
  "sender": "10008663",
  "message": "Your message content"
}
```

## Error Handling

The nodes include comprehensive error handling:
- Invalid credentials
- Network connectivity issues
- API rate limiting
- Invalid phone numbers
- Template not found errors

Enable "Continue on Fail" in node settings to handle errors gracefully in your workflows.

## Requirements

- n8n version 0.174.0 or later
- Node.js 20.15 or later
- Valid Kavenegar account and API key

## Development

### Prerequisites

- Node.js 20.15+
- npm
- n8n installed globally

### Setup

```bash
git clone https://github.com/rezamh/n8n-nodes-kavenegar.git
cd n8n-nodes-kavenegar
npm install
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
npm run lintfix  # Auto-fix issues
```

### Local Testing

```bash
# Link the package locally
npm link

# In your n8n installation directory
npm link n8n-nodes-kavenegar

# Restart n8n
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- 📖 [Kavenegar API Documentation](https://kavenegar.com/rest.html)
- 🐛 [Report Issues](https://github.com/rezamh/n8n-nodes-kavenegar/issues)
- 💬 [n8n Community Forum](https://community.n8n.io)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Author

**Reza Mahdi Hadi**
- Email: reza.mh67@gmail.com
- GitHub: [@rezamh](https://github.com/rezamh)

---

Made with ❤️ for the n8n community
