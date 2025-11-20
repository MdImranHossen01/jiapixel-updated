"use client";

import { useState } from 'react';

interface UseFreeServiceModalReturn {
  isOpen: boolean;
  serviceTitle: string;
  serviceType: string;
  openModal: (title: string, type: string) => void;
  closeModal: () => void;
}

export const useFreeServiceModal = (): UseFreeServiceModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceType, setServiceType] = useState('');

  const openModal = (title: string, type: string) => {
    setServiceTitle(title);
    setServiceType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setServiceTitle('');
    setServiceType('');
  };

  return {
    isOpen,
    serviceTitle,
    serviceType,
    openModal,
    closeModal,
  };
};