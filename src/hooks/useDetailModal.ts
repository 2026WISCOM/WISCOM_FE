import { useState } from "react";

export function useDetailModal<T>() {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
