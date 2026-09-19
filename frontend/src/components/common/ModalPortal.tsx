import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
}

export const ModalPortal = ({ children }: ModalPortalProps) => {
  return createPortal(children, document.body);
};