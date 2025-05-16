import { PaymentRequest, PaymentResponse } from "./types";
import { EfiBankService } from "./efiBank";
import { mapEfiBankStatus } from "./utils";
import { WebhookService } from "./webhook";
import { TransactionService } from "./transactions/TransactionService";
import { PaymentResponseMapper } from "./mappers/PaymentResponseMapper";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for handling payment processing with Efi Bank
 */
export const PaymentService = {
  /**
   * Creates a new payment request
   */
  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      // First, get the Efi Bank configuration
      const efiConfig = await EfiBankService.getConfiguration();
      
      // Generate a valid UUID for business ID if a numeric string is provided
      const businessId = payment.businessId && !payment.businessId.includes("-") 
        ? uuidv4() 
        : payment.businessId || uuidv4();
      
      // Register the transaction in our database
      const dbTransaction = await TransactionService.createTransaction({
        serviceId: payment.serviceId,
        appointmentId: payment.appointmentId || null,
        customerId: payment.customerId,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        description: payment.description || "Pagamento de serviço",
        businessId: businessId
      });
      
      // Configure the data for the Efi Bank API call
      const efiPaymentData = efiConfig 
        ? await EfiBankService.callEfiPayAPI({
            amount: payment.amount,
            description: payment.description || "Pagamento de serviço",
            paymentMethod: payment.paymentMethod,
            referenceId: dbTransaction.id,
            merchantId: efiConfig.merchant_id,
            apiKey: efiConfig.api_key,
            isTestMode: efiConfig.is_test_mode
          })
        : await EfiBankService.simulateEfiBankAPICall({
            amount: payment.amount,
            description: payment.description || "Pagamento de serviço",
            paymentMethod: payment.paymentMethod,
            referenceId: dbTransaction.id
          });
      
      // Update the transaction with the data returned by Efi Bank
      if (efiPaymentData.transactionId) {
        await TransactionService.updateTransactionWithProviderData(
          dbTransaction.id,
          {
            transaction_id: efiPaymentData.transactionId,
            payment_url: efiPaymentData.paymentUrl,
            status: mapEfiBankStatus(efiPaymentData.status),
            provider: 'efi_bank'
          }
        );
      }

      const paymentResponse = PaymentResponseMapper.mapToPaymentResponse(
        dbTransaction,
        {
          status: efiPaymentData.status,
          transactionId: efiPaymentData.transactionId,
          paymentUrl: efiPaymentData.paymentUrl
        }
      );

      // Send webhook notification
      WebhookService.sendWebhookNotification('payment.created', {
        payment_id: paymentResponse.id,
        status: paymentResponse.status,
        amount: paymentResponse.amount,
        payment_method: paymentResponse.paymentMethod
      });

      return paymentResponse;
    } catch (error) {
      console.error("Erro ao processar pagamento com Efi Bank:", error);
      
      // If it's a database error, throw a more specific error
      if (error.message && error.message.includes("row-level security policy")) {
        console.error("Database error:", error);
        throw new Error("Erro de banco de dados: " + error.message);
      }
      
      // Otherwise throw a generic error
      throw new Error("Falha ao processar pagamento. Por favor, tente novamente.");
    }
  },

  /**
   * Checks the status of a payment in Efi Bank
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      // Get transaction from database
      const transactionData = await TransactionService.getTransaction(paymentId);
      
      // Parse transaction notes to get Efi Bank data
      let transactionId = '';
      
      if (transactionData.notas) {
        try {
          const notesData = JSON.parse(transactionData.notas);
          transactionId = notesData.transaction_id || '';
        } catch (e) {
          console.log("Notes is not valid JSON:", e);
        }
      }
      
      // Query the status in the Efi Bank API or simulate the query
      const efiStatusData = await EfiBankService.checkEfiBankStatus(transactionId || paymentId);
      
      // Update the status if there's a change
      if (transactionData.status !== mapEfiBankStatus(efiStatusData.status)) {
        const isPaid = efiStatusData.status === "approved";
        await TransactionService.updateTransactionStatus(
          paymentId, 
          mapEfiBankStatus(efiStatusData.status),
          isPaid
        );
      }
      
      return PaymentResponseMapper.mapToPaymentResponse(
        transactionData,
        {
          status: efiStatusData.status,
          transactionId: transactionId || efiStatusData.transactionId,
          paymentUrl: efiStatusData.paymentUrl
        }
      );
    } catch (error) {
      console.error("Erro ao consultar status do pagamento no Efi Bank:", error);
      throw new Error("Não foi possível obter o status do pagamento.");
    }
  }
};
