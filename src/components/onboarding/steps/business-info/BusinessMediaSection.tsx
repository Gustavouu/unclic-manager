
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoUpload } from "./LogoUpload";
import { BannerUpload } from "./BannerUpload";

export const BusinessMediaSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagens do Estabelecimento</CardTitle>
        <CardDescription>
          Adicione imagens para personalizar a identidade visual do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Logo</h3>
            <LogoUpload />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Banner</h3>
            <BannerUpload />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
