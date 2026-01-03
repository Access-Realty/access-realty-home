// ABOUTME: Placeholder modal for savings comparison - Justin Lovett working on final design
// ABOUTME: Will show interactive calculator comparing DirectList vs traditional agent costs

"use client";

import { HiXMark } from "react-icons/hi2";
import Link from "next/link";

interface SavingsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavingsCalculatorModal({ isOpen, onClose }: SavingsCalculatorModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">Calculate Your Savings</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <HiXMark className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Placeholder Content */}
        <div className="p-8 text-center space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 font-medium">
              🚧 Savings Calculator Coming Soon
            </p>
            <p className="text-amber-700 text-sm mt-1">
              An interactive comparison tool is being built to show exactly how much you can save.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-primary">Save up to $12,000+</p>
            <p className="text-muted-foreground">
              on a typical home sale compared to traditional 3% listing commission
            </p>
          </div>

          <Link
            href="/get-started"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}
