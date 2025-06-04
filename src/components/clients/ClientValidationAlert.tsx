
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { checkDataIntegrity } from '@/utils/databaseUtils';

interface ValidationIssue {
  table_name: string;
  issue_type: string;
  issue_count: number;
  description: string;
}

export const ClientValidationAlert: React.FC = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const checkIntegrity = async () => {
    setIsLoading(true);
    try {
      const integrityIssues = await checkDataIntegrity();
      const filteredIssues = integrityIssues.filter((issue: ValidationIssue) => issue.issue_count > 0);
      setIssues(filteredIssues);
      setIsVisible(filteredIssues.length > 0);
    } catch (error) {
      console.error('Error checking data integrity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIntegrity();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium mb-2">Problemas de integridade de dados detectados:</p>
            <ul className="text-sm space-y-1">
              {issues.map((issue, index) => (
                <li key={index}>
                  • {issue.description}: {issue.issue_count} registro(s)
                </li>
              ))}
            </ul>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkIntegrity}
            disabled={isLoading}
            className="ml-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Verificar novamente
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
