
import { rest } from 'msw';

export const handlers = [
  // Mock Supabase API calls
  rest.post('*/rest/v1/rpc/set_business_status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ success: true })
    );
  }),
  
  // Add more handlers as needed
];
