# GWebmail: Gmail Integrated Webmail Application

Welcome to GWebmail! GWebmail is a simple and memorable web application that integrates seamlessly with Gmail, allowing
you to manage your emails efficiently. This README will guide you through setting up and using the application
effectively.

## Installation

To get started with GWebmail, follow these simple steps:

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/PicassoHouessou/gmail.git
   ```

2. Navigate to the project directory:

   ```
   cd gwebmail
   ```

3. Install dependencies using npm:

   ```
   npm install
   ```

## Configuration

Before you can start using GWebmail, you need to configure the Gmail API credentials.

1. Go to the [Google Developers Console](https://console.developers.google.com/).
2. Create a new project (if you haven't already).
3. Enable the Gmail API for your project.
4. Create OAuth 2.0 credentials for the application.
5. Set the authorized redirect URIs. For development, you can use `http://localhost:8080` as the redirect URI.
6. Download the JSON file containing your client ID and client secret.
7. Edit the `.env` file in the root directory of the GWebmail application and add your client ID and client secret in
   the following format.

## Usage

After configuring the Gmail API credentials, you can start using GWebmail.

1. Start the development server:

   ```
   npm run serve
   ```

2. Open your web browser and navigate to `http://localhost:8080`.

3. Sign in with your Google account and authorize the application to access your Gmail account.

4. Once authorized, you can start sending and receiving emails using GWebmail.

## Demo

Check out the live demo of GWebmail: [Demo](https://gmail.picassohouessou.com)

## Features

- **Compose Email**: Create and send emails to any recipient.
- **Inbox**: View received emails in your inbox.
- **Read Email**: Read emails in detail.
- **Reply to Email**: Respond to emails directly from the application.

## Technologies Used

- Vue.js 2: A progressive JavaScript framework for building user interfaces.
- Gmail API: Allows the application to access Gmail features programmatically.
- JavaScript: The primary programming language used for the application logic.
- HTML/CSS: For structuring and styling the user interface.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a
pull request on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or support, please contact [Picasso Houessou](mailto:houessoupicasso@yahoo.fr).

Feel free to customize this README to fit your specific application details and preferences. Happy coding!