import { CloseIcon } from './icons';

const CloseBtn = ({ disabled, handleClose }: { disabled?: boolean; handleClose: () => void }) => {
    return (
        <div>
            <button
                type='button'
                disabled={disabled}
                onClick={handleClose}
                className='action_button'
            >
                <CloseIcon fill='fill-cgray dark:fill-white' sizes='h-4 w-4' />
            </button>
        </div>
    )
}

export default CloseBtn