
import { PaymentIntegrationDashboard } from "@/components/admin/payment/PaymentIntegrationDashboard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Payments() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("efi-bank");

  useEffect(() => {
    // Se houver um parâmetro de tab na URL, use-o para definir a aba ativa
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto">
      <PaymentIntegrationDashboard initialTab={activeTab} />
    </div>
  );
}
