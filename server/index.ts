import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import winston from 'winston';
import rateLimit from 'express-rate-limit';
import retry from 'retry';

dotenv.config();

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const app = express();
const BACKEND_PORT = 3002; // Fixed backend port

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Apply rate limiter to all routes
app.use(limiter);

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Allow frontend origin
  credentials: true
}));
app.use(express.json());

// Validation Schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Service selection is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

// Validation middleware
const validateContactForm = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    contactFormSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email transporter with retry logic
const createEmailOperation = (mailOptions: nodemailer.SendMailOptions) => {
  const operation = retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 5000,
  });

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      try {
        const info = await transporter.sendMail(mailOptions);
        logger.info('Email sent successfully', {
          messageId: info.messageId,
          attempt: currentAttempt,
        });
        resolve(info);
      } catch (error) {
        logger.error('Error sending email', {
          error,
          attempt: currentAttempt,
        });
        if (operation.retry(error as Error)) {
          return;
        }
        reject(operation.mainError());
      }
    });
  });
};

// Contact form endpoint with enhanced error handling
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    const notificationMailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Contact Form Submission - ${service}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const confirmationMailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Thank you for contacting PowderPro',
      html: `
        <h2>Thank you for contacting PowderPro</h2>
        <p>Dear ${name},</p>
        <p>We have received your inquiry about our ${service} service. Our team will review your message and get back to you within 1-2 business days.</p>
        <p>Here's a summary of your message:</p>
        <p>${message}</p>
        <br>
        <p>Best regards,</p>
        <p>The PowderPro Team</p>
      `,
    };

    // Send emails with retry logic
    await Promise.all([
      createEmailOperation(notificationMailOptions),
      createEmailOperation(confirmationMailOptions),
    ]);

    logger.info('Contact form submission processed successfully', {
      email,
      service,
    });

    res.status(200).json({ 
      success: true,
      message: 'Message sent successfully' 
    });
  } catch (error) {
    logger.error('Failed to process contact form submission', {
      error,
      body: req.body,
    });

    res.status(500).json({ 
      success: false,
      message: 'Failed to send message',
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'An unexpected error occurred'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    error: err,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(BACKEND_PORT, () => {
  logger.info(`Backend server running on port ${BACKEND_PORT}`);
}); 