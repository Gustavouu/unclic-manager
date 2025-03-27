
import React from "react";

interface WebsiteFooterProps {
  businessName: string;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({ businessName }) => {
  return (
    <div className="mt-12 text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} {businessName}. Todos os direitos reservados.</p>
      <p className="mt-1">
        Criado com <a href="/" className="text-primary hover:underline">unclic</a>
      </p>
    </div>
  );
};
