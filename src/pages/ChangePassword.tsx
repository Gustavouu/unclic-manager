import { MainLayout } from '@/components/layout/MainLayout';
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm';

export function ChangePassword() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
              <p className="mt-1 text-sm text-gray-600">
                Update your password to keep your account secure.
              </p>
            </div>
          </div>

          <div className="mt-5 md:mt-0 md:col-span-2">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 