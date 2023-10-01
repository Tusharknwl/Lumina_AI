<br />
<div align="center">
  <a href="https://github.com/Tusharknwl/expense-tracker">
    <img src="public/logo0.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">LUMINA AI</h3>

  <p align="center">
    An open source Saas platform to help users to use many AI tools such as AI assistant , image, code, music and video generation in one platform.
    <br />
    <a href="https://luminaai.tech">View Demo</a>
    ·
    <a href="https://github.com/Tusharknwl/Lumina_AI/issues">Report Bug</a>
    ·
    <a href="https://github.com/Tusharknwl/Lumina_AI/issues">Request Feature</a>
  </p>
</div>

## About The Project
![Lumina AI banner](/public/banner.png)

Lumina AI is a SaaS-based AI platform built with Next.js, Shadcn, Tailwind CSS, Clerk, and the OpenAI API. It offers various AI-powered features such as AI chat assistant, image generation, code generation,video and music generation.

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

Lumina AI comes with a wide range of AI-powered features, including:

- **Chatbot**: A AI chatbot that can answer user queries.
- **Image Generation**: Generate stunning images using AI.
- **Code Generation**: Automatically generate code snippets based on user requirements.
- **Video**: Generate a video clip based on user input.
- **Music Generation**: Generate music beat based on user input.

## Demo

Visit our [Lumina.AI](https://lumina-ai-one.vercel.app/)

## Installation

To get started with Lumina AI, follow these steps:

1. Clone this repository:
   ```shell
   git clone https://github.com/Tusharknwl/Lumina_AI.git

2. Change to the project directory:
    ```shell
    cd Lumina_AI

3. Install dependencies:
    ```shell
    npm install

4. Configure your environment variables. Refer to the [Configuration](#configuration) section for details.

5. Start the development server:
    ```shell
    npm run dev

6. Open your web browser and navigate to http://localhost:3000 to access the application.


## Configuration

To configure Lumina AI, you'll need to set the following environment variables:

- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Your Clerk Publishable Key.
- **CLERK_SECRET_KEY**: Your Clerk Secret Key.
- **NEXT_PUBLIC_CLERK_SIGN_IN_URL**: The URL for user sign-in (e.g., `/sign-in`).
- **NEXT_PUBLIC_CLERK_SIGN_UP_URL**: The URL for user sign-up (e.g., `/sign-up`).
- **NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL**: The URL users are redirected to after signing in (e.g., `/dashboard`).
- **NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL**: The URL users are redirected to after signing up (e.g., `/dashboard`).
- **OPENAI_API_KEY**: Your OpenAI API Key.
- **REPLICATE_API_TOKEN**: Your Replicate API Token.

Create a `.env` file in the project root directory and define these variables as follows:

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
    OPENAI_API_KEY=your_openai_api_key
    REPLICATE_API_TOKEN=your_replicate_api_token

## Contributing

We welcome contributions from the community. Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Credits

This project was created with the invaluable guidance and inspiration from the following YouTube tutorial:

- [Build a SaaS AI Platform](https://www.youtube.com/watch?v=ffJ38dBzrlY)
  - By: [Code With Antonio](https://www.youtube.com/@codewithantonio)

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://tusharknwl.github.io/portfolio-2021)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tushar-khanagwal/)
