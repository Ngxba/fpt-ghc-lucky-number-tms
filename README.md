# Lucky Draw - Celebration Starts Here! ✨

A beautiful, minimal, and celebratory lucky draw application with account and ticket management. Built with React, Node.js, Express, and MongoDB Atlas, packaged as a single Docker image.

## Features

### Account Management
- Create accounts with unique account numbers and optional names
- View all accounts with their associated tickets
- Beautiful card-based interface with celebration theme

### Ticket Management
- Add ticket numbers to accounts with global uniqueness validation
- Check for duplicate tickets before assignment
- Remove tickets from accounts while keeping the account intact
- Visual feedback with confetti animations on successful actions

### Search & Lookup
- Search by ticket number to find the associated account
- Search by account number to list all tickets
- Real-time results with elegant card displays

### System Rules
- One ticket number can only be assigned to one account (global uniqueness)
- One account can have multiple ticket numbers
- All ticket numbers must be unique across the system
- Input validation for all operations

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Canvas Confetti** - Celebration animations
- **Axios** - HTTP client
- **Custom CSS** - Beautiful, responsive design with celebration theme
- **Fonts**: Fredoka (headings) & DM Sans (body)

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - ODM for MongoDB

### DevOps
- **Docker** - Single image containerization
- Backend serves both API and static frontend files

## Quick Start with Docker

### Prerequisites
- Docker (20.10+)

### Running with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd fpt-ghc-lucky-draw
```

2. Configure MongoDB Atlas credentials in `backend/.env`:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB Atlas URI
```

3. Build the Docker image:
```bash
docker build -t luckydraw-app .
```

4. Run the container:
```bash
docker run -d \
  -p 5000:5000 \
  --env-file backend/.env \
  --name luckydraw \
  luckydraw-app
```

5. Access the application at http://localhost:5000

6. To stop the container:
```bash
docker stop luckydraw
docker rm luckydraw
```

## Development Setup (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with MongoDB Atlas credentials:
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas URI
```

4. Start the backend server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

Frontend will run on http://localhost:3000

## API Endpoints

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `POST /api/accounts` - Create new account
  ```json
  {
    "accountNumber": "ACC001",
    "name": "John Doe"
  }
  ```
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Tickets
- `POST /api/tickets` - Add ticket to account
  ```json
  {
    "accountId": "507f1f77bcf86cd799439011",
    "ticketNumber": "TICKET001"
  }
  ```
- `GET /api/tickets/check/:ticketNumber` - Check if ticket exists
- `DELETE /api/tickets/:accountId/:ticketNumber` - Remove ticket from account

### Search
- `GET /api/search/ticket/:ticketNumber` - Search by ticket number
- `GET /api/search/account/:accountNumber` - Search by account number

### Health Check
- `GET /api/health` - Check API and database status

## Project Structure

```
fpt-ghc-lucky-draw/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Celebration-themed styles
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── .env
├── backend/
│   ├── models/
│   │   └── Account.js      # Mongoose schema
│   ├── routes/
│   │   ├── accounts.js     # Account endpoints
│   │   ├── tickets.js      # Ticket endpoints
│   │   └── search.js       # Search endpoints
│   ├── server.js           # Express server (serves API + frontend)
│   ├── package.json
│   └── .env                # MongoDB Atlas credentials
├── Dockerfile              # Multi-stage Docker build
├── .dockerignore
└── README.md
```

## Design Features

### Color Palette
- **Coral**: #FF6B6B - Primary actions, celebration
- **Gold**: #FFD93D - Accents, highlights
- **Teal**: #4ECDC4 - Secondary actions
- **Lavender**: #A78BFA - Decorative elements
- **Background**: #FEFBF6 - Soft, warm base

### Animations
- Confetti burst on successful operations
- Smooth card entrance animations
- Hover effects with elevation
- Floating background confetti pieces
- Staggered reveals for content

### Responsive Design
- Mobile-first approach
- Adapts to all screen sizes
- Touch-friendly interface
- Optimized for both desktop and mobile

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName
NODE_ENV=development
```

## Docker Deployment

### Push to Docker Registry

1. Tag the image:
```bash
docker tag luckydraw-app:latest YOUR_USERNAME/luckydraw-app:latest
```

2. Push to Docker Hub:
```bash
docker push YOUR_USERNAME/luckydraw-app:latest
```

### Pull and Run

```bash
docker pull YOUR_USERNAME/luckydraw-app:latest
docker run -d -p 5000:5000 --env-file backend/.env YOUR_USERNAME/luckydraw-app:latest
```

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, map to a different port:
```bash
docker run -d -p 8080:5000 --env-file backend/.env luckydraw-app
```
Access at http://localhost:8080

### MongoDB Atlas Connection Issues
- Verify your MongoDB Atlas URI in `backend/.env`
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check database user credentials

### View Container Logs
```bash
docker logs luckydraw
```

## Future Enhancements

- User authentication and authorization
- Bulk ticket import/export
- Advanced search with filters
- Ticket history and audit logs
- Real-time updates with WebSockets
- Analytics dashboard
- Export reports (PDF, CSV)
- QR code generation for tickets
- Multi-language support

## License

MIT License - feel free to use this project for your needs!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ and ✨ confetti
