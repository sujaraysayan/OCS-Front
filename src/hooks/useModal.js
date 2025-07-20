import { useState, useCallback } from "react";

export const useModal = (initialState) => {
  const [isOpen, setIsOpen] = useState(initialState || false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, openModal, closeModal, toggleModal };
};