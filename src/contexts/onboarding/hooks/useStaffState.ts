
import { useState } from 'react';
import { StaffData } from '../types';

export const useStaffState = () => {
  const [staffMembers, setStaffMembers] = useState<StaffData[]>([]);
  const [hasStaff, setHasStaff] = useState<boolean>(false);

  // Function to add a new staff member
  const addStaffMember = (staff: StaffData) => {
    setStaffMembers(prev => [...prev, staff]);
  };

  // Function to remove a staff member
  const removeStaffMember = (id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
  };

  // Function to update a staff member
  const updateStaffMember = (id: string, data: Partial<StaffData>) => {
    setStaffMembers(prev =>
      prev.map(staff => (staff.id === id ? { ...staff, ...data } : staff))
    );
  };

  return {
    staffMembers,
    setStaffMembers,
    hasStaff,
    setHasStaff,
    addStaffMember,
    removeStaffMember,
    updateStaffMember,
  };
};
