"use client";

interface InfoMessageProps {
    title: string;
    subtitle?: string;
    type: "warning" | "success" | "info" | "pending" | "censored";
}

const InfoMessage = ({ title, subtitle, type }: InfoMessageProps) => {
    return (
        <div className="px-3 py-8 mx-auto flex flex-col items-center justify-center max-w-sm">
            <div className="p-2 rounded-full bg-caqua/10">
                {type == "warning" ? <WarningIcon /> :
                    type === "info" ? <InfoIcon /> :
                        type === "success" ? <SuccessIcon /> :
                            type === "censored" ? <CloseEyeIcon /> :
                                <></>
                }
            </div>
            <p className="font-medium mt-3">{title}</p>
            {subtitle ? (
                <div className={`px-2 mt-2 `}>
                    <p className="text-center text-sm md:text-base text-slate-600">{subtitle}</p>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

const InfoIcon = () => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="h-8 w-8">
                <path
                    stroke="#093731"
                    strokeLinecap="round"
                    strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>

        </div>
    );
};
const SuccessIcon = () => {
    return (
        <div>
            <svg
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
                className="h-8 w-8"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>

        </div>
    );
};
const CloseEyeIcon = () => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#093731"
                className="w-8 h-8"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
            </svg>
        </div>
    );
};
const WarningIcon = () => {
    return (
        <div>
            <svg
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
                className="h-8 w-8"
            >
                <path
                    d="m13 13 6 6m0-6-6 6m15-3c0 6.627-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4s12 5.373 12 12Z"
                    stroke="#093731"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
            </svg>
        </div>
    );
};

export default InfoMessage;
