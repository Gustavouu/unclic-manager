
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsLogoUpload } from './SettingsLogoUpload';
import { SettingsBannerUpload } from './SettingsBannerUpload';

export const LogoImagesSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagens do Negócio</CardTitle>
        <CardDescription>
          Adicione logo e banner para personalizar a aparência do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <SettingsLogoUpload />
        <SettingsBannerUpload />
      </CardContent>
    </Card>
  );
};
