import { useState } from "react";

import AppButton from "@/components/AppButton";
import Modal from "@/components/AppModal";
import AppSection from "@/components/AppSection";

export default function TestModal() {
  const [isOpen, setIsOpen] = useState(false);
  // const modalRef = useRef<HTMLDialogElement | null>(null);
  const toggleDialog = () => {
    console.log(`Setting isOpen to ${isOpen}`);
    setIsOpen(!isOpen);
  };
  return (
    <main>
      <AppSection>
        <AppButton text="Open modal" onClick={toggleDialog} />
        <Modal isOpen={isOpen} toggle={toggleDialog}>
          <h1>Test Modal</h1>
        </Modal>
      </AppSection>
    </main>
  );
}
