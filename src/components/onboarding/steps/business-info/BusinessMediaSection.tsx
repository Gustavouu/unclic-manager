
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoUploadFixed } from "./LogoUploadFixed";
import { BannerUploadFixed } from "./BannerUploadFixed";

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
            <LogoUploadFixed />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Banner</h3>
            <BannerUploadFixed />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
