// ABOUTME: Reusable accordion component for FAQ sections
// ABOUTME: Supports single or multiple items open at once

"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="divide-y divide-border">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div key={index}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-primary pr-4">{item.question}</span>
              <HiChevronDown
                className={`h-5 w-5 text-primary shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? "max-h-[800px] pb-5" : "max-h-0"
              }`}
            >
              <p className="text-muted-foreground">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
