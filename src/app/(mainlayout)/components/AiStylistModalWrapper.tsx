"use client";
import React, { useState } from 'react';

import dynamic from 'next/dynamic';
import { Navbar } from './banner/components/Navbar';

const AiStylistModal = dynamic(() => import('./banner/components/AiStylistModal').then(mod => mod.AiStylistModal), {
  ssr: false,
});


const AiStylistModalWrapper: React.FC = () => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <>
      <Navbar onSearchClick={() => setIsAiModalOpen(true)} />
      <AiStylistModal
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
      />
    </>
  );
};

export default AiStylistModalWrapper;