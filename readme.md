# 🌱 Habit Tracker

A full-stack application for tracking and managing your daily habits. Build positive routines, track your progress, and achieve your personal goals.

![Habit Tracker](https://img.shields.io/badge/Status-In%20Development-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

<div align="center">
  <img src="/api/placeholder/800/400" alt="Habit Tracker Screenshot" />
</div>

## ✨ Features

- 📝 Create and manage custom habits
- 📊 Track daily progress and streaks
- 📈 Visualize habit completion trends
- 🔔 Set reminders for habit completion
- 🔒 Secure user authentication
- 📱 Responsive design for mobile and desktop

## 🛠️ Tech Stack

### Backend
- FastAPI
- MongoDB
- JWT Authentication
- Python 3.8+

### Frontend
- React
- Tailwind CSS
- Axios
- Chart.js

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker
```

## 🔙 Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-multipart pymongo
```

4. Start the backend server:
```bash
# Method 1: Using uvicorn directly
uvicorn main:app --reload --port 8000

# Method 2: Using Python script
python main.py
```

The backend server will be available at: `http://localhost:8000`

### API Documentation

- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/`
- API Routes: `http://localhost:8000/api/`
- Auth Routes: `http://localhost:8000/api/auth/`

## 🖥️ Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will be available at: `http://localhost:3000`

## 📁 Project Structure

```
habit-tracker/
├── backend/
│   ├── main.py           # Main FastAPI application
│   ├── routes.py         # Habit-related routes
│   ├── auth_routes.py    # Authentication routes
│   └── requirements.txt  # Project dependencies
│
├── frontend/
│   ├── public/           # Static files
│   ├── src/              # React source code
│   ├── package.json      # Frontend dependencies
│   └── README.md         # Frontend readme
│
└── README.md             # Main project readme
```

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```
SECRET_KEY=your_secret_key
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=habit_tracker
```

## 🐛 Troubleshooting

### Backend Issues

If you encounter "Address already in use" error:

1. Find the process using the port:
```bash
# Windows
netstat -ano | findstr :8000

# macOS/Linux
lsof -i :8000
```

2. Kill the process:
```bash
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### MongoDB Issues

Ensure MongoDB is running:

```bash
# Check MongoDB status
mongod --version

# Start MongoDB service if not running
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

## 📝 Development Notes

- Keep the virtual environment activated while working on the backend
- Use `deactivate` command to exit the Python virtual environment
- Frontend uses port 3000, backend uses port 8000
- API endpoints are documented using Swagger UI at `/docs`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/habit-tracker](https://github.com/your-username/habit-tracker)