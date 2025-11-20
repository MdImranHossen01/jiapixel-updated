"use client";
import React, { useState } from 'react';

import { AiStylistModal } from './banner/components/AiStylistModal';
import { Navbar } from './banner/components/Navbar';


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