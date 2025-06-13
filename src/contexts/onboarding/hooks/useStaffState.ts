
import { useState } from 'react';
import { StaffData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useStaffState = () => {
  const [staffMembers, setStaffMembers] = useState<StaffData[]>([]);
  const [hasStaff, setHasStaff] = useState(false);

  const addStaffMember = (staff: StaffData) => {
    const newStaff = {
      ...staff,
      id: staff.id || uuidv4()
    };
    setStaffMembers(prev => [...prev, newStaff]);
  };

  const updateStaffMember = (id: string, updatedStaff: Partial<StaffData>) => {
    setStaffMembers(prev => prev.map(staff => 
      staff.id === id ? { ...staff, ...updatedStaff } : staff
    ));
  };

  const removeStaffMember = (id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
  };

  return {
    staffMembers,
    hasStaff,
    setHasStaff,
    addStaffMember,
    updateStaffMember,
    removeStaffMember,
    setStaffMembers,
  };
};
