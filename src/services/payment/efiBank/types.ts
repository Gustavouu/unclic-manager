
export type PlanInterval = "month" | "week" | "year" | "day";
export type PlanStatus = "active" | "inactive" | "archived";
export type SubscriptionStatus = "active" | "pending" | "canceled" | "past_due" | "trialing" | "unpaid";
export type InvoiceStatus = "open" | "void" | "draft" | "paid" | "uncollectible";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: PlanInterval;
  interval_count: number;
  status: PlanStatus;
  features: string[];
  provider_plan_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  customer_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: Date;
  end_date: Date;
  cancel_at_period_end: boolean;
  canceled_at: Date;
  payment_method: string;
  provider_subscription_id: string;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Invoice {
  id: string;
  subscription_id: string;
  customer_id: string;
  amount: number;
  status: InvoiceStatus;
  due_date: Date;
  paid_date: Date;
  payment_method: string;
  provider_invoice_id: string;
  line_items: any[];
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}
