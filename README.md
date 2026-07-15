# 🔍 Markdown Link Checker CLI

[![CI](https://github.com/kainturasourav0-star/markdown-link-checker/actions/workflows/ci.yml/badge.svg)](https://github.com/kainturasourav0-star/markdown-link-checker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A clean, light-weight, and professional command-line utility to extract, validate, and check local and remote hyperlinks in markdown documents.

## 🚀 Features
*   Parses markdown files to extract hyperlinks (`http://`, `https://`, and local relative paths).
*   Validates whether remote targets exist (making asynchronous HTTP HEAD/GET requests).
*   Validates local file path references.
*   Reports clear, color-coded terminal outputs indicating link statuses.

## 📦 Installation

Ensure you have Node.js installed on your machine.

Clone the repository and install dependencies:
```bash
npm install
```

## 💻 Usage

To scan a markdown file with default settings:
```bash
npm start -- path/to/file.md
```

To configure a custom request timeout (e.g. 2000 milliseconds):
```bash
npm start -- path/to/file.md --timeout 2000
```

To run in quiet mode (only reporting dead links):
```bash
npm start -- path/to/file.md --quiet
```

## 🧪 Running Tests

Validate functionality via Jest:
```bash
npm test
```

<!-- Enabled collaboration check -->

