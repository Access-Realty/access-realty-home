// ABOUTME: Client wrapper that opens TierSelectionModal when clicked
// ABOUTME: Used on pricing cards to trigger tier selection flow

"use client";

import { useState } from "react";
import { TierSelectionModal } from "./TierSelectionModal";

interface TierSelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  initialTier?: string;
  source?: string;
}

export function TierSelectTrigger({
  children,
  className = "",
  initialTier = "direct-list-plus",
  source = "direct-list-page",
}: TierSelectTriggerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={className}>
        {children}
      </button>
      <TierSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTier={initialTier}
        source={source}
      />
    </>
  );
}
