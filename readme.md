# Habit Tracker Backend

## Setup and Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
.\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-multipart pymongo
```

## Running the Server

There are several ways to start the FastAPI server:

### Method 1: Using uvicorn directly
```bash
uvicorn main:app --reload --port 8000
```
or 
```
fastapi dev main.py
```
### Method 2: Using Python
Add this code to the end of main.py:
```python
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
```

Then run:
```bash
python main.py
```

## Project Structure
```
backend/
├── main.py           # Main FastAPI application
├── routes.py         # Habit-related routes
├── auth_routes.py    # Authentication routes
└── requirements.txt  # Project dependencies
```

## API Endpoints

- Base URL: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/`
- API Routes: `http://localhost:8000/api/`
- Auth Routes: `http://localhost:8000/api/auth/`

## Development

- The server runs in development mode with hot reload enabled
- CORS is enabled for all origins
- API documentation is available at the `/docs` endpoint

## Dependencies

- FastAPI
- Uvicorn
- Python-jose
- Passlib
- Python-multipart
- PyMongo

## Common Issues

If you encounter "Address already in use" error:
1. Find the process using the port:
```bash
netstat -ano | findstr :8000
```
2. Kill the process:
```bash
taskkill /PID <PID> /F
```

## Notes

- Make sure MongoDB is running if using database features
- Keep virtual environment activated while working on the project
- Use `deactivate` command to exit virtual environment