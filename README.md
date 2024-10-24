# **Authentication System with Secure Access and Todo Page**

This project implements a secure authentication system using **JavaScript**, with token management via **localStorage** and **cookies**. After successful signup/login, users are redirected to a `todo.html` page, which is protected and accessible only to authenticated users. Unauthorized access attempts will result in a redirection to the login page.

## **Technologies Used**
- **Frontend:**
  - HTML5 & CSS3 for user interface design
  - JavaScript (ES6) for client-side logic
  - EJS (Embedded JavaScript) templates (if server-side rendering is required)
  
- **Backend:**
  - **Node.js** with **Express.js** for the server
  - **PostgreSQL** as the database  
  - **JWT (jsonwebtoken)** for authentication tokens  
  - **bcryptjs** for password hashing  
  - **dotenv** for environment variables  
  - **express-validator** for request validation 

- **Storage:**
  - **localStorage** for persistent token management
  - **Cookies** with `Secure` and `SameSite` flags for cross-site security

## **Features**
- **Signup & Login System:** Users can sign up and log in.
- **Token Storage:** Tokens are securely saved in both `localStorage` and cookies.
- **Page Protection:** `todo.html` is accessible only with a valid token.
- **Automatic Redirects:** Unauthorized users are redirected to the login page.
- **Logout Functionality:** Clears tokens from both `localStorage` and cookies.

## **Project Structure**

```bash
/project-root
│
├── /assets
│   └── /fonts
│       └── Poppins-Regular.ttf
├── /views
│   ├── loginForm.html
│   ├── signUpForm.html
│   ├── todo.html
│   └── forgotPassword.html
├── /js
│   ├── api.js
│   └── auth.js
└── README.md
```

# How to Run the Project
1. Clone the repository:
```bash
git clone <repository-url>
cd project-root
```
2. Open `loginForm.html` or `signUpForm.html` in a browser.
3. After **signup/login**, you will be redirected to `todo.html` if the token is valid.

# How It Works
## **Authentication Flow:**
1. **Signup/Login:**
Users enter their credentials.
After successful authentication, a token is stored in both:
localStorage: `localStorage.setItem('token', result.token);`
Cookies: `document.cookie = "token=" + result.token;`
2. Token Validation on Secure Pages:
A function checks for tokens in localStorage or cookies.
If no token is found, users are redirected to `loginForm.html.`
3. Logout:
Clears the token from both **localStorage** and **cookies**.
Redirects the user to the login page.



### Backend

```bash
 cd backend
 yarn start # for development
```

### Frontend

```bash
 cd frontend
 live-server .
```

# Code Snippets
### Signup Function (Token Storage & Redirection)

```javascript
async function handleSignUp(event) {
    event.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;

    if (password !== confirmPassword) {
        document.querySelector('.error').innerText = 'Passwords do not match.';
        return;
    }

    try {
        const result = await signup(name, email, password);
        if (result.error) {
            document.querySelector('.error').innerText = result.error;
        } else {
            localStorage.setItem('token', result.token);
            document.cookie = `token=${result.token}; path=/; Secure; SameSite=Strict`;
            window.location.href = 'todo.html';
        }
    } catch (error) {
        document.querySelector('.error').innerText = 'An error occurred during signup.';
    }
}
```

### Token Validation and Page Security
```javascript
const allowedPages = ['loginForm.html', 'index.html', 'signUpForm.html', ''];

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
}

function validateAccess() {
    const token = localStorage.getItem('token') || getCookie('token');
    const currentPage = window.location.pathname.split('/').pop();

    if (!token && !allowedPages.includes(currentPage)) {
        alert('You must log in to access this page.');
        window.location.href = 'loginForm.html';
    }
}

window.onload = validateAccess;
```

### Logout Function

```javascript
function logout() {
    localStorage.removeItem('token');
    document.cookie = 'token=; Max-Age=0; path=/';
    window.location.href = 'loginForm.html';
}
```

# How to Use

1. Signup: Create an account via signUpForm.html.
2. Login: Use the credentials to log in via loginForm.html.
3. Access Todo Page: On successful login, you will be redirected to todo.html.
4. Logout: Use the logout button on todo.html to log out.

# Security Measures

1. SameSite Cookies: Prevents cross-site request forgery (CSRF).
2. Secure Flag: Ensures cookies are sent only over HTTPS.
3. Redirects on Unauthorized Access: Protects restricted pages like todo.html.

# Future Improvements

1. Add password encryption for extra security.
2. Implement JWT expiration handling.
3. Add forgot password functionality to reset passwords securely.

# License

This project is licensed under the MIT License. See LICENSE for more details.

Contact
If you have any questions, reach out to:

Developers:
1. Edwin Waweru
2. 
3.
4. 