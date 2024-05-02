// Resources
import { modalBackground } from '@/lib/constants';
import { ModalProps } from '@/lib/types';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const Modal = ({ handleClose, children, isOpen }: ModalProps) => {

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        } else {
            document.removeEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, handleClose]);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isOpen]);

    return (
        <AnimatePresence
            initial={false}
            onExitComplete={() => null}
        >
            {isOpen && (
                <motion.div
                    variants={modalBackground}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    // onClick={() => handleClose()}
                    className="fixed inset-0 top-0 z-50 backdrop-blur-sm bg-black/50 flex-center p-2"
                >
                    {/* children props required !
                        onClick={(e) => e.stopPropagation()}
                        variants={enterModal}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    > */}
                    {children}
                    {/* </motion.span> */}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
