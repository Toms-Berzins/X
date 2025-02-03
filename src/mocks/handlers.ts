import { http, HttpResponse } from 'msw';

export const handlers = [
  // Contact form submission
  http.post('/api/contact', async () => {
    return HttpResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  }),

  // Health check
  http.get('/api/health', async () => {
    return HttpResponse.json(
      { status: 'healthy' },
      { status: 200 }
    );
  }),
]; 