// Resources
import { enterModal, modalBackground, swipeCard } from '@/lib/constants';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { ModalProps } from '@/lib/types';

{/* children props required! =>
    onClick={(e) => e.stopPropagation()}
    variants={enterModal}
    initial="hidden"
    animate="visible"
    exit="exit"
*/}

const BlackOutModal = ({ handleClose, children, isOpen }: ModalProps) => {

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
            mode='wait'
        >
            {isOpen ? (
                <motion.div
                    variants={modalBackground}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className='fixed top-0 left-0 z-10 w-screen h-screen flex flex-col bg-slate-100 dark:bg-cblack'
                    onClick={(e) => { return e.stopPropagation() }}
                >
                    {children}
                </motion.div>
            ) : null
            }
        </AnimatePresence >
    );

};

export default BlackOutModal;

