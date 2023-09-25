
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
