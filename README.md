# ExamTrack360 - Examination Tracking System

A comprehensive examination tracking system built with React, Node.js, and MongoDB. Features role-based access control, exam management, result tracking, and performance analytics.

## 🚀 Features

### 👥 Role-Based Access Control

- **Admin**: Full system access, user management, analytics
- **Teacher**: Exam creation, result upload, class performance tracking
- **Student**: View personal results, exam schedules, performance analytics

### 📊 Core Functionality

- **Exam Management**: Create, edit, delete, and schedule exams
- **Result Management**: Upload scores, generate reports, track performance
- **Performance Analytics**: Interactive charts and detailed performance insights
- **User Management**: Complete CRUD operations for users
- **Notifications**: Email and SMS notifications (optional)
- **PDF Reports**: Generate and download report cards

### 🎨 Modern UI/UX

- Clean, responsive design with Tailwind CSS
- Indigo-teal color palette
- Smooth animations with Framer Motion
- Interactive charts with Recharts
- Mobile-first approach

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **React Hook Form** with Zod validation
- **Framer Motion** for animations
- **Axios** for API communication

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Multer** for file uploads
- **Nodemailer** for email notifications
- **PDF-lib** for PDF generation

## 📁 Project Structure

```
ExamTrack360/
├── backend/                 # Node.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utilities and API client
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main app component
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
└── shared/                 # Shared utilities and types
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ExamTrack360
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/health

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/examtrack360
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/examtrack360

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/change-password` - Change password

### User Management (Admin)

- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/role/:role` - Get users by role

### Exam Management

- `GET /api/exams` - List exams
- `POST /api/exams` - Create exam
- `PUT /api/exams/:id` - Update exam
- `DELETE /api/exams/:id` - Delete exam
- `GET /api/exams/upcoming` - Get upcoming exams
- `GET /api/exams/completed` - Get completed exams

### Result Management

- `GET /api/results` - List results
- `POST /api/results` - Create result
- `PUT /api/results/:id` - Update result
- `DELETE /api/results/:id` - Delete result
- `POST /api/results/bulk` - Bulk upload results

### Performance Analytics

- `GET /api/performance/student/:id` - Student performance
- `GET /api/performance/exam/:id` - Exam performance
- `GET /api/performance/teacher/:id` - Teacher performance
- `GET /api/performance/dashboard` - Dashboard stats

## 🎯 Key Features Explained

### Role-Based Access Control

The system implements three distinct user roles:

1. **Admin**: Full system access including user management, system analytics, and administrative functions
2. **Teacher**: Can create exams, upload results, view class performance, and manage their assigned students
3. **Student**: Can view their exam schedules, results, and personal performance analytics

### Exam Management

- Create exams with detailed information (title, subject, date, duration, marks)
- Target specific grades, sections, or individual students
- Upload attachments (question papers, instructions)
- Track exam status (scheduled, ongoing, completed, cancelled)

### Result Management

- Upload individual or bulk results
- Automatic grade calculation based on percentage
- Detailed breakdown (theory, practical, assignment)
- Teacher comments and student remarks
- Appeal system for result disputes

### Performance Analytics

- Interactive charts showing performance trends
- Subject-wise performance analysis
- Class performance comparisons
- Top and bottom performers
- Grade distribution analysis

### Notifications

- Email notifications for exam reminders and result announcements
- SMS notifications (optional, requires Twilio)
- Configurable notification preferences per user

## 🎨 UI/UX Design

### Color Palette

- **Primary**: Indigo (#4F46E5)
- **Secondary**: Teal (#14B8A6)
- **Background**: Light gray (#F9FAFB)
- **Cards**: White (#FFFFFF)
- **Text**: Dark gray (#111827)

### Design Principles

- Clean, minimal interface
- Soft shadows and rounded corners
- Smooth hover effects and transitions
- Mobile-responsive design
- Accessibility considerations

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based route protection
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js security headers

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🚀 Deployment

### Backend Deployment

1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like:
   - Render
   - Railway
   - Heroku
   - DigitalOcean

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to platforms like:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- Real-time notifications with WebSocket
- Advanced analytics and reporting
- Mobile app development
- Integration with LMS platforms
- Advanced file upload and management
- Multi-language support
- Advanced search and filtering
- Export functionality (Excel, CSV)

---

**ExamTrack360** - Empowering educational institutions with comprehensive examination management solutions.
#   E x a m T r a c k 3 6 0  
 