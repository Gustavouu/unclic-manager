
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Supabase API calls
  http.post('*/rest/v1/rpc/set_business_status', () => {
    return HttpResponse.json({ success: true });
  }),
  
  // Add more handlers as needed
];
