
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { ThemeSwitcher } from "./ThemeSwitcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SettingsCollapsible() {
  return (
    <Collapsible className="w-full">
      <div className="flex items-center justify-between px-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="justify-start">
            <Icons.settings className="mr-2 h-4 w-4" />
            <span>Avançado</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 px-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between rounded-md p-2">
            <Label htmlFor="theme">Tema</Label>
            <ThemeSwitcher />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
