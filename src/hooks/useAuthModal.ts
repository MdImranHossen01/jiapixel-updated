"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ServiceTier {
  title: string;
  description: string;
  price: number;
  deliveryDays?: number;
  revisions?: number;
}

interface UseAuthModalReturn {
  isOpen: boolean;
  serviceTitle: string;
  selectedTier: ServiceTier | null;
  serviceUrl: string; // Add service URL to return type
  openModal: (title: string, tier: ServiceTier | null, serviceUrl?: string) => void; // tier can be null if no specific tier is selected
  closeModal: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const useAuthModal = (): UseAuthModalReturn => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [serviceTitle, setServiceTitle] = useState('');
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null);
  const [serviceUrl, setServiceUrl] = useState(''); // Add service URL state

  const openModal = (title: string, tier: ServiceTier | null, serviceUrl: string = '') => {
    setServiceTitle(title);
    setSelectedTier(tier);
    setServiceUrl(serviceUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setServiceTitle('');
    setSelectedTier(null);
    setServiceUrl('');
  };

  return {
    isOpen,
    serviceTitle,
    selectedTier,
    serviceUrl,
    openModal,
    closeModal,
    isLoggedIn: !!session,
    isLoading: status === 'loading'
  };
};