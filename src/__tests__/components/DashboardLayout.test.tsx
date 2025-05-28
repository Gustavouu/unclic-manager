// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

describe('DashboardLayout', () => {
  it('deve renderizar o título do dashboard', () => {
    render(<DashboardLayout />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
}); 