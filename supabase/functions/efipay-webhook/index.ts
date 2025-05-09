
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import * as crypto from 'https://deno.land/std@0.177.0/crypto/mod.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  event: string;
  data: any;
  event_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the webhook payload
    const payload = await req.json() as WebhookPayload;
    const { event, data, event_id } = payload;
    
    if (!event || !data || !event_id) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Received webhook: ${event}, ID: ${event_id}`);

    // Validate the webhook
    const signature = req.headers.get('x-efipay-signature');
    const validationResult = await validateWebhook(req, signature, supabase);
    
    if (!validationResult.valid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store the event in the database
    const { error: insertError } = await supabase
      .from('webhook_events')
      .insert({
        provider: 'efi_pay',
        event_type: event,
        event_id: event_id,
        payload: data,
        processed: false,
        tenant_id: validationResult.businessId
      });

    if (insertError) {
      console.error('Error saving webhook:', insertError);
      return new Response(
        JSON.stringify({ error: 'Error processing webhook' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process based on event type
    let success = false;
    
    switch (event) {
      case 'charge.status_updated':
        success = await processChargeStatusUpdate(data, supabase);
        break;
      case 'subscription.created':
      case 'subscription.updated':
        success = await processSubscriptionUpdate(data, supabase);
        break;
      case 'subscription.canceled':
        success = await processSubscriptionCanceled(data, supabase);
        break;
      default:
        console.log(`Unhandled event type: ${event}`);
        success = true; // Mark as processed since we don't need to handle it
    }

    // Mark the webhook as processed
    if (success) {
      await supabase
        .from('webhook_events')
        .update({
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq('provider', 'efi_pay')
        .eq('event_id', event_id);
      
      console.log(`Successfully processed webhook: ${event}, ID: ${event_id}`);
    } else {
      await supabase
        .from('webhook_events')
        .update({
          error: 'Failed to process webhook'
        })
        .eq('provider', 'efi_pay')
        .eq('event_id', event_id);
      
      console.error(`Failed to process webhook: ${event}, ID: ${event_id}`);
    }

    // Return success to EFI Pay
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Validate the webhook signature
 */
async function validateWebhook(req: Request, signature: string | null, supabase: any) {
  if (!signature) {
    return { valid: false };
  }

  // Find the webhook secret for this business
  const { data: providerData, error } = await supabase
    .from('payment_providers')
    .select('webhook_secret, tenant_id')
    .eq('provider_name', 'efi_pay')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (error || !providerData || !providerData.webhook_secret) {
    console.error('Error finding webhook secret:', error);
    return { valid: false };
  }

  // Calculate the expected signature
  const secret = providerData.webhook_secret;
  const bodyText = await req.clone().text();
  
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);
  const message = encoder.encode(bodyText);
  
  const key = await crypto.subtle.importKey(
    "raw",
    secretKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  
  const mac = await crypto.subtle.sign("HMAC", key, message);
  const hashArray = Array.from(new Uint8Array(mac));
  const expectedSignature = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return { 
    valid: expectedSignature === signature, 
    businessId: providerData.tenant_id 
  };
}

/**
 * Process charge status update webhooks
 */
async function processChargeStatusUpdate(data: any, supabase: any): Promise<boolean> {
  try {
    const chargeId = data.charge_id;
    const status = data.status;
    
    // Find the invoice with this charge ID
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('id')
      .eq('provider_invoice_id', chargeId)
      .single();

    if (error || !invoice) {
      console.error('Error finding invoice for charge:', error);
      return false;
    }

    // Map EFI Pay status to our status
    let invoiceStatus;
    switch (status) {
      case 'paid':
        invoiceStatus = 'paid';
        break;
      case 'canceled':
        invoiceStatus = 'void';
        break;
      case 'expired':
        invoiceStatus = 'uncollectible';
        break;
      case 'waiting':
        invoiceStatus = 'open';
        break;
      default:
        invoiceStatus = 'open';
    }

    // Update the invoice status
    const updateData: any = { status: invoiceStatus };
    
    if (invoiceStatus === 'paid') {
      updateData.paid_date = new Date().toISOString();
    }
    
    if (data.payment?.payment_method) {
      updateData.payment_method = data.payment.payment_method;
    }
    
    const { error: updateError } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoice.id);

    return !updateError;
  } catch (error) {
    console.error('Error processing charge status update:', error);
    return false;
  }
}

/**
 * Process subscription update webhooks
 */
async function processSubscriptionUpdate(data: any, supabase: any): Promise<boolean> {
  try {
    const subscriptionId = data.subscription_id;
    const status = data.status;
    
    // Find the subscription with this provider ID
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('provider_subscription_id', subscriptionId)
      .single();

    if (error || !subscription) {
      console.error('Error finding subscription:', error);
      return false;
    }

    // Map EFI Pay status to our status
    let subStatus;
    switch (status) {
      case 'active':
        subStatus = 'active';
        break;
      case 'canceled':
        subStatus = 'canceled';
        break;
      case 'expired':
        subStatus = 'canceled';
        break;
      default:
        subStatus = 'active';
    }

    // Update the subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ status: subStatus })
      .eq('id', subscription.id);

    return !updateError;
  } catch (error) {
    console.error('Error processing subscription update:', error);
    return false;
  }
}

/**
 * Process subscription canceled webhooks
 */
async function processSubscriptionCanceled(data: any, supabase: any): Promise<boolean> {
  try {
    const subscriptionId = data.subscription_id;
    
    // Find the subscription with this provider ID
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('provider_subscription_id', subscriptionId)
      .single();

    if (error || !subscription) {
      console.error('Error finding subscription:', error);
      return false;
    }

    // Update the subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'canceled',
        canceled_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    return !updateError;
  } catch (error) {
    console.error('Error processing subscription canceled:', error);
    return false;
  }
}
