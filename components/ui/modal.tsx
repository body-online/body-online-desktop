// Resources
import { enterModal, modalBackground } from '@/lib/constants';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CloseIcon } from './icons';
import { ModalProps } from '@/lib/types';

{/* children props required! =>
    onClick={(e) => e.stopPropagation()}
    variants={enterModal}
    initial="hidden"
    animate="visible"
    exit="exit"
*/}

const Modal = ({ handleClose, children, isOpen, hideCloseBtn }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && handleClose) {
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
        if (isOpen) document.body.style.overflowY = "hidden";
        else document.body.style.overflowY = "auto";
    }, [isOpen]);

    return (
        <AnimatePresence
            initial={false}
        >
            {isOpen && (
                <motion.div
                    variants={modalBackground}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed top-0 left-0 h-screen w-screen flex-center 
                    backdrop-blur bg-cgray/50 dark:bg-cblack/50 backdrop-saturate-200 z-40 px-2 overflow-hidden"
                    onClick={(e) => { return e.stopPropagation() }}
                >
                    <div className="max-h-[95vh] max-w-2xl w-full m-auto flex flex-col my-auto">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;

