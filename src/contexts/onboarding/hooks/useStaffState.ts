
import { useState, useCallback } from "react";
import { StaffData } from "../types";

export const useStaffState = () => {
  const [staffMembers, setStaffMembers] = useState<StaffData[]>([]);
  const [hasStaff, setHasStaff] = useState<boolean>(false);

  // Staff management functions
  const addStaffMember = useCallback((staff: StaffData) => {
    setStaffMembers(prev => [...prev, staff]);
  }, []);

  const removeStaffMember = useCallback((id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
  }, []);

  const updateStaffMember = useCallback((id: string, data: Partial<StaffData>) => {
    setStaffMembers(prev => 
      prev.map(staff => staff.id === id ? { ...staff, ...data } : staff)
    );
  }, []);

  return {
    staffMembers,
    setStaffMembers,
    hasStaff,
    setHasStaff,
    addStaffMember,
    removeStaffMember,
    updateStaffMember
  };
};
