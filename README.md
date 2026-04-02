# ResumeForge — Smart ATS-Ready Resume Builder

ResumeForge is a professional, full-stack resume builder designed to help job seekers create ATS-compatible resumes with a live preview and real-time scoring. Built with a clean UI and powerful backend processing, it ensures your resume is both visually appealing and machine-readable.

## ✨ Features

- **Smart Resume Builder**: Intuitive form-based entry for personal info, experience, education, and skills.
- **Live XSLT Preview**: See your resume update in real-time as you type, powered by fast in-browser XSLT rendering.
- **ATS Checker**: Instant scoring against 8 critical rules to optimize your resume for Applicant Tracking Systems.
- **PDF Export**: Generate a high-quality, print-ready PDF using server-side mPDF.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), TypeScript (compiled to ES6), Bootstrap 5.
- **Templating**: XML (Data Structure), XSLT (Transformation & Rendering).
- **Backend**: PHP 8.x (API Endpoints, XML Handling).
- **PDF Generation**: mPDF (Composer Library).

## 🚀 How to Run Locally

### Prerequisites
- **PHP 8.0 or higher** installed on your system.
- **Composer** (optional, but requested for managing dependencies).

### Setup Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/resumeforge.git
   cd resumeforge
   ```

2. **Initialize the server**:
   Navigate to the `resume-builder` folder and start the PHP built-in server:
   ```bash
   php -S localhost:8000
   ```

3. **Open in Browser**:
   Visit the following URL to start building your resume:
   [http://localhost:8000/client/html/builder.html](http://localhost:8000/client/html/builder.html)

## 📂 Project Structure

```text
├── client/
│   ├── css/          # Custom styles and animations
│   ├── html/         # Builder and Landing pages
│   ├── js/           # Compiled JavaScript logic
│   ├── ts/           # TypeScript source files
│   └── xsl/          # Local XSLT templates for live preview
└── server/
    ├── php/          # Backend API (ATS check, PDF & XML generation)
    ├── xml/          # Temporary XML storage
    ├── xsl/          # XSLT templates for PDF generation
    └── vendor/       # Composer dependencies (mPDF)
```

## 📄 License
This project is for personal and portfolio use. Feel free to use and modify it as you see fit.
