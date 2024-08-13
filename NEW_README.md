
# Book Directory

## Overview
Book Directory is a simple web application that allows users to search for and manage books in a personal collection. The application integrates with the Google Books API to fetch book information and provides user authentication, allowing users to sign up, log in, and manage their book collections.

## Features
- **Search Books**: Search for books using the Google Books API.
- **User Authentication**: Sign up, log in, and log out functionality.
- **Manage Collections**: Users can add books to their personal collection and view them.
- **Responsive Design**: The application is responsive and works well on various devices.
- **Error Handling**: Custom error pages for a better user experience.

## Technologies Used
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: EJS (Template Engine), Tailwind CSS
- **API Integration**: Google Books API
- **Session Management**: Express-Session
- **Middleware**: Custom and third-party middlewares for authentication, method overrides, and more.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-directory.git
   ```
2. Navigate to the project directory:
   ```bash
   cd book-directory
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following environment variables:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     SESSION_SECRET=your_session_secret
     GOOGLE_BOOKS_API_KEY=your_google_books_api_key
     ```

5. Start the application:
   ```bash
   npm start
   ```

6. Open your browser and go to `http://localhost:3000`.

## Usage

- **Sign Up**: Create a new user account.
- **Log In**: Log in with your credentials.
- **Search for Books**: Use the search bar to find books by title, author, or ISBN.
- **Add to Collection**: Save books to your personal collection.
- **View Collection**: Access your collection from your profile.

## Folder Structure

- **`config/`**: Configuration files for the database, session, and other settings.
- **`controllers/`**: Handles the application's business logic.
- **`middleware/`**: Custom middleware functions.
- **`public/`**: Static files such as CSS, JavaScript, and images.
- **`routes/`**: Route definitions for the application.
- **`services/`**: Services like the Google Books API integration.
- **`utils/`**: Utility functions used across the application.
- **`views/`**: EJS templates for rendering the UI.

## Contributing
Feel free to fork this repository, make changes, and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
