// Resources
import { enterModal, modalBackground } from '@/lib/constants';
import { ModalProps } from '@/lib/types';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

{/* children props required! =>
    onClick={(e) => e.stopPropagation()}
    variants={enterModal}
    initial="hidden"
    animate="visible"
    exit="exit"
*/}

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
                    className="fixed inset-0 top-0 z-50 backdrop-blur-sm bg-cgreen/50 flex-center overflow-hidden px-2"
                    onClick={(e) => { return e.stopPropagation() }}
                >
                    <div className="relative w-full max-w-max">
                        {/* close indicator */}
                        <motion.button
                            variants={enterModal}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            type='button'
                            onClick={() => handleClose()}
                            className="px-1 py-1 rounded-md bg-slate-200 absolute top-2 right-2 z-20">
                            <p className='text-[10px] sm:text-[12px] font-bold text-slate-500'>ESC</p>
                        </motion.button>


                        {children}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;

