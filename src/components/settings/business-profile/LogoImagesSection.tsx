
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SettingsLogoUpload } from "./SettingsLogoUpload";
import { SettingsBannerUpload } from "./SettingsBannerUpload";

export const LogoImagesSection = () => {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <SettingsLogoUpload />
        <SettingsBannerUpload />
      </CardContent>
    </Card>
  );
};
