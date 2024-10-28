import { CloseIcon } from './icons';

const CloseBtn = ({ disabled, handleClose }: { disabled?: boolean; handleClose: () => void }) => {
    return (
        <div>
            <button
                type='button'
                disabled={disabled}
                onClick={handleClose}
                className='md:hover:opacity-100 md:opacity-50 transition-all disabled:opacity-30 h-7 w-7 flex-center'
            >
                <CloseIcon fill='fill-cgray dark:fill-white' />
            </button>
        </div>
    )
}

export default CloseBtn