# Currency MCP Server

A beginner-friendly MCP (Model Context Protocol) server built with TypeScript and Node.js that provides live currency exchange functionality using the Frankfurter currency API.

This project was built as a structured learning exercise to understand:

* MCP server architecture
* MCP tools
* stdio transport
* TypeScript modular architecture
* external API integrations
* schema validation
* centralized configuration
* production-safe logging
* structured MCP responses

---

# Features

## MCP Tools

### `health_check`

Check whether the MCP server is running correctly.

---

### `get_supported_currencies`

Retrieve the list of currencies supported by the API.

---

### `get_exchange_rate`

Retrieve the live exchange rate between two currencies.

---

### `convert_currency`

Convert an amount from one currency to another using live exchange rates.

---

# Technology Stack

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| TypeScript      | Application language            |
| Node.js         | Runtime                         |
| MCP SDK         | MCP server framework            |
| Zod             | Input validation                |
| dotenv          | Environment variable management |
| Frankfurter API | Currency exchange data          |

---

# Project Structure

```text
currency-mcp-server
├── src
│   ├── config
│   │   └── appConfig.ts
│   ├── schemas
│   │   └── currencySchemas.ts
│   ├── services
│   │   └── currencyService.ts
│   ├── types
│   │   └── currencyTypes.ts
│   ├── utils
│   │   ├── dateUtils.ts
│   │   ├── errorUtils.ts
│   │   └── logger.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

# MCP Architecture

```text
MCP Client
    ↓
stdio Transport
    ↓
Currency MCP Server
    ↓
Frankfurter Currency API
```

---

# Requirements

* Node.js 22+
* npm
* PowerShell or Bash
* VS Code recommended

---

# Installation

## Clone Repository

```bash
git clone <your-repository-url>
cd currency-mcp-server
```

---

## Install Dependencies

```bash
npm install
```

---

# Environment Configuration

Create:

```text
.env
```

Example:

```env
CURRENCY_API_BASE_URL=https://api.frankfurter.dev/v2
NODE_ENV=development
```

---

# Run The MCP Server

```bash
npm run dev
```

Expected behavior:

```text
Server waits silently for MCP client connections.
```

---

# Testing With MCP Inspector

Launch MCP Inspector:

```bash
npx @modelcontextprotocol/inspector
```

Open the provided browser URL.

---

## MCP Inspector Configuration

### Transport

```text
stdio
```

### Command

```text
npx
```

### Arguments

```text
tsx src/index.ts
```

---

# Available MCP Tools

---

# 1. `health_check`

## Description

Checks whether the MCP server is running properly.

## Example Input

```json
{}
```

## Example Output

```json
{
  "status": "ok",
  "service": "currency-mcp-server",
  "version": "2.0.0"
}
```

---

# 2. `get_supported_currencies`

## Description

Retrieves supported currencies from the Frankfurter API.

## Example Input

```json
{}
```

## Example Output

```json
{
  "currencies": [
    {
      "code": "USD",
      "name": "United States Dollar"
    }
  ],
  "count": 1
}
```

---

# 3. `get_exchange_rate`

## Description

Retrieves the live exchange rate between two currencies.

## Example Input

```json
{
  "from": "USD",
  "to": "TTD"
}
```

## Example Output

```json
{
  "from": "USD",
  "to": "TTD",
  "rate": 6.75,
  "date": "2026-05-18"
}
```

---

# 4. `convert_currency`

## Description

Converts an amount between currencies.

## Example Input

```json
{
  "amount": 100,
  "from": "USD",
  "to": "TTD"
}
```

## Example Output

```json
{
  "amount": 100,
  "from": "USD",
  "to": "TTD",
  "rate": 6.75,
  "convertedAmount": 675,
  "date": "2026-05-18"
}
```

---

# Logging

This project uses centralized logging through:

```text
src/utils/logger.ts
```

Important MCP consideration:

```text
console.log() should not be used in stdio MCP servers.
```

The project safely logs using:

```text
console.error()
```

because stdout is reserved for MCP protocol communication.

---

# Error Handling

The project includes centralized error handling utilities:

```text
src/utils/errorUtils.ts
```

Features:

* safe error parsing
* structured MCP error responses
* production-safe handling
* reusable utility functions

---

# Configuration Management

The project uses:

```text
dotenv
```

for centralized environment configuration.

Configuration is managed through:

```text
src/config/appConfig.ts
```

This pattern prepares the project for future enterprise MCP servers involving:

* Proxmox APIs
* Kubernetes APIs
* Veeam APIs
* Ticketing APIs
* Dell infrastructure APIs

---

# Lessons Learned

This project demonstrates understanding of:

* MCP server architecture
* MCP stdio transport
* TypeScript modular architecture
* Node.js ESM configuration
* Zod schema validation
* external API integration
* structured MCP responses
* environment variable management
* centralized logging
* enterprise-style project organization

---

# Future Improvements

Potential future enhancements:

* caching exchange rates
* rate history support
* conversion trends
* WebSocket transport
* authentication
* Docker containerization
* unit testing
* CI/CD pipeline
* OpenTelemetry logging
* Prometheus metrics

---

# License

ISC License

---

# Acknowledgements

* MCP SDK
* Frankfurter Currency API
* Node.js ecosystem
* TypeScript ecosystem
