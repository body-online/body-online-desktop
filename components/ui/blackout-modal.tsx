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
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isOpen]);

    return (
        <AnimatePresence
            initial={false}
            mode='wait'
        >
            {isOpen && (
                <motion.div
                    variants={modalBackground}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed h-screen w-screen inset-0 top-0 z-50 bg-white flex-center overflow-hidden px-2"
                    onClick={(e) => { return e.stopPropagation() }}
                >
                    {/* close indicator */}
                    {handleClose ?
                        <motion.button
                            variants={enterModal}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            type='button'
                            onClick={() => handleClose()}
                            className="px-1 py-1 rounded-md bg-slate-200 absolute top-4 right-4 z-20">
                            <p className='text-[10px] sm:text-[12px] font-bold text-cgray hidden md:block text-slate-500'>ESC</p>
                            <CloseIcon fill='fill-cgray md:hidden' />
                        </motion.button> : null
                    }
                    <div className="relative w-full max-w-max">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BlackOutModal;

