# React Blog Frontend

This is the frontend for a blog application built with React, Redux Toolkit, JWT authentication, Tailwind CSS, and Axios.

## Features
- User authentication (login/logout) using JWT.
- Display a list of blog posts with filtering, sorting, and searching.
- View detailed blog posts with nested comments.
- Add, edit, and delete posts.
- Like/unlike posts.
- Add and reply to comments.

## Tech Stack
- **React**: Frontend library
- **Redux Toolkit**: State management
- **JWT**: Authentication
- **Axios**: API requests
- **Tailwind CSS**: Styling

## Installation

### Prerequisites
Ensure you have Node.js and npm/yarn installed.

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/jasirck/Blog-Application-with-Comments-Django-React-FronEnd.git
   cd Blog-Application-with-Comments-Django-React-FronEnd

   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the development server:
   ```sh
   npm start  # or yarn start
   ```
## API Endpoints
- `POST /auth/login/` - User login
- `GET /posts/` - Fetch all posts
- `POST /posts/` - Create a post
- `GET /posts/:id/` - Get a single post
- `POST /comments/` - Add a comment
- `POST /likes/` - Like a post

## Redux Setup
- `authSlice.js` - Manages user authentication state.
- `postSlice.js` - Handles posts data.


