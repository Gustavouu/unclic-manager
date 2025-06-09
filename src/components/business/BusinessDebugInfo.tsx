
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiTenant } from '@/contexts/MultiTenantContext';

export const BusinessDebugInfo: React.FC = () => {
  const { user, profile } = useAuth();
  const { currentBusiness, businesses } = useMultiTenant();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold">User Info</h4>
          <p>Email: {user?.email}</p>
          <p>ID: {user?.id}</p>
        </div>
        
        <div>
          <h4 className="font-semibold">Profile Info</h4>
          <p>Name: {profile?.full_name}</p>
          <p>Business ID: {profile?.business_id}</p>
        </div>
        
        <div>
          <h4 className="font-semibold">Current Business</h4>
          <p>Name: {currentBusiness?.name}</p>
          <p>ID: {currentBusiness?.id}</p>
          <p>Status: {currentBusiness?.status}</p>
        </div>
        
        <div>
          <h4 className="font-semibold">Available Businesses ({businesses.length})</h4>
          {businesses.map(business => (
            <p key={business.id}>{business.name} ({business.id})</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
