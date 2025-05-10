
/**
 * Calculate annual recurring revenue from monthly recurring revenue
 */
export function calculateARR(mrr: number): number {
  return mrr * 12;
}

/**
 * Calculate conversion rate from active subscriptions and total customers
 */
export function calculateConversionRate(activeSubscriptions: number, totalCustomers: number): number {
  return totalCustomers > 0 ? (activeSubscriptions / totalCustomers) * 100 : 0;
}

/**
 * Calculate churn rate from canceled subscriptions and total subscriptions
 */
export function calculateChurnRate(
  canceledSubscriptions: number, 
  activeSubscriptions: number
): number {
  const totalSubscriptionsAtStartOfPeriod = activeSubscriptions + canceledSubscriptions;
  return totalSubscriptionsAtStartOfPeriod > 0 
    ? (canceledSubscriptions / totalSubscriptionsAtStartOfPeriod) * 100 
    : 0;
}

/**
 * Calculate average revenue per customer
 */
export function calculateARPC(mrr: number, activeCustomers: number): number {
  return activeCustomers > 0 ? mrr / activeCustomers : 0;
}

/**
 * Calculate customer lifetime value (CLV)
 * Formula: (Average Revenue Per Customer / Churn Rate) * Profit Margin
 */
export function calculateCLV(
  avgRevenuePerCustomer: number, 
  churnRatePercent: number, 
  profitMargin: number = 0.8
): number {
  return churnRatePercent > 0 
    ? (avgRevenuePerCustomer / (churnRatePercent / 100)) * profitMargin 
    : 0;
}
