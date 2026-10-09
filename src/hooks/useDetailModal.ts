import { useState } from "react";

export function useDetailModal<T>(initialItem: T | null = null) {
  const [selectedItem, setSelectedItem] = useState<T | null>(initialItem);
  const [isOpen, setIsOpen] = useState(initialItem !== null);

  function open(item: T) {
    setSelectedItem(item);
    setIsOpen(true);
  }

  function close() {
    // Keep the selected content mounted while the dialog animates closed.
    setIsOpen(false);
  }

  return { selectedItem, isOpen, open, close };
}
