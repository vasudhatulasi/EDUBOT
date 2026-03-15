# StudyTracker 📚

A comprehensive academic monitoring system that empowers parents to stay informed about their child's educational journey through an intuitive web interface and AI-powered insights.

## 🌟 Features

### For Parents
- **Secure OTP Authentication**: Login using phone number verification
- **Real-time Academic Dashboard**: View grades, attendance, CGPA, and fee status
- **Interactive Visualizations**: Charts and graphs for better understanding of academic progress
- **AI-Powered Chatbot**: Ask questions about your child's performance in natural language
- **Comprehensive Reports**: Generate PDF reports of academic data
- **Multi-language Support**: Interface available in multiple languages
- **Profile Management**: Update preferences and settings

### Academic Tracking
- **Grade Monitoring**: Mid-term and semester exam results
- **Attendance Tracking**: Subject-wise attendance percentages
- **CGPA Analysis**: Current and semester-wise CGPA trends
- **Backlog Management**: Track pending and cleared backlogs
- **Fee Management**: Monitor payment status and due dates
- **Exam Notifications**: Upcoming exam schedules and details
- **Coding Profile**: Integration with LeetCode and CodeChef performance

## 🏗️ Architecture

### Backend (Node.js/Express)
- **API Endpoints**: RESTful APIs for authentication, data retrieval, and chatbot
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: OTP-based verification using Twilio
- **AI Integration**: OpenAI GPT models via OpenRouter for intelligent responses
- **Security**: Input sanitization and CORS protection

### Frontend (React/Vite)
- **Modern UI**: Responsive design with clean, intuitive interface
- **Routing**: Client-side routing with React Router
- **Charts**: Interactive visualizations using Chart.js and Recharts
- **State Management**: React hooks for local state management
- **PDF Generation**: Export reports using jsPDF

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- OpenAI API key (via OpenRouter)
- Twilio account for SMS (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studytracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with required environment variables
   npm run seed  # Optional: Seed sample data
   npm run dev   # Start development server
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev   # Start development server
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/studytracker
OPENAI_API_KEY=your-openai-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
PORT=5000
```

## 📁 Project Structure

```
studytracker/
├── backend/
│   ├── models/
│   │   ├── Student.js
│   │   └── OTP.js
│   ├── package.json
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AcademicProgress.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ProfileSettings.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
└── README.md
```

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛡️ Security Features

- OTP-based authentication with expiration
- Input sanitization to prevent XSS attacks
- CORS protection
- Environment variable management
- Secure API endpoints

## 🤖 AI Chatbot

The integrated AI assistant helps parents understand their child's academic data by:
- Answering questions about grades, attendance, and performance
- Providing insights and recommendations
- Generating visualizations suggestions
- Maintaining context about the student's academic history

## 📊 Data Models

### Student Model
- Personal information (name, registration number, contact details)
- Academic records (semesters, subjects, marks, attendance)
- Financial data (fees, payment status)
- Performance metrics (CGPA, backlogs)
- Coding profiles (LeetCode, CodeChef)
- Notifications and upcoming exams

### OTP Model
- Phone number verification with automatic expiration (5 minutes)

## 🌐 Technologies Used

### Backend
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **OpenAI**: AI integration
- **Twilio**: SMS service
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment management

### Frontend
- **React**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Chart.js**: Data visualization
- **Recharts**: Additional charting library
- **Axios**: HTTP client
- **jsPDF**: PDF generation

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support or questions, please open an issue in the repository.