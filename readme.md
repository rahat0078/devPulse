## DevPulse API

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

### Live URL

https://devpulse-lyart.vercel.app/

### Features

- User Registration & Login
- JWT Authentication & Authorization
- Role-based Access Control (Contributor & Maintainer)
- Create Issues
- Get All Issues
- Get Single Issue
- Update Issues
- Delete Issues
- Filtering & Sorting Support

### Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- pg
- bcryptjs
- jsonwebtoken

### Installation

#### Clone Repository

```bash
git clone https://github.com/rahat0078/devPulse.git
cd devPulse
```

#### Install Dependencies

```bash
npm install
```

#### Create Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

#### Run Development Server

```bash
npm run dev
```

#### Build Project

```bash
npm run build
```

#### Run Production Server

```bash
npm start
```

## API Endpoints

#### Authentication

| Method | Endpoint             |
| -------- | -------------------- |
| POST   | /api/auth/signup     |
| POST   | /api/auth/login      |

#### Issues

| Method | Endpoint            |
| -------- | ------------------- |
| POST   | /api/issues         |
| GET    | /api/issues         |
| GET    | /api/issues/:id     |
| PATCH  | /api/issues/:id     |
| DELETE | /api/issues/:id     |

### Query Parameters

#### Get All Issues

```http
GET /api/issues?sort=oldest
GET /api/issues?type=bug
GET /api/issues?status=open
```

### Database Schema

#### Users Table

- id
- name
- email
- password
- role
- created_at
- updated_at

#### Issues Table

- id
- title
- description
- type
- status
- reporter_id
- created_at
- updated_at

### Author

**Ruhul Amin Rahat**  
📧 Email: raharahat1710@gmail.com