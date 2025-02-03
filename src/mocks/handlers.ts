import { rest } from 'msw';

export const handlers = [
  // Contact form submission
  rest.post('/api/contact', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Message sent successfully' })
    );
  }),

  // Health check
  rest.get('/api/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ status: 'healthy' })
    );
  }),
]; 