import React from 'react'
const DefaultLayout = ({ children, customBackgrounds }: { children: React.ReactNode, customBackgrounds?: string }) => {

    return (
        <div
            className={`relative top-0 left-0 flex flex-col z-30 w-screen min-h-screen h-full overflow-y-auto ${customBackgrounds ?? ''}`}
        >
            {children}
        </div >
    )
}

export default DefaultLayout

export const LayoutHeader = ({ children }: { children: React.ReactNode, }) => {
    return (
        <div className="w-full sticky top-0 py-3 md:py-6 custom-gradient sm:backdrop-blur-lg z-20 border-b custom-border">
            <div className="flex-between w-full gap-2 px-default">
                {children}
            </div>
        </div>
    )
}

export const LayoutBottom = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full sticky bottom-0 py-3 custom-gradient sm:backdrop-blur-lg z-20 mt-auto border-t custom-border'>
            <div className="flex-between w-full gap-2 px-default">
                {children}
            </div>
        </div>
    )
}