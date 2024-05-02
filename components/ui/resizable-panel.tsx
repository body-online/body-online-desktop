'use client'

import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";


const ignoreCircularReferences = () => {
    const seen = new WeakSet();
    return (key: any, value: any) => {
        if (key.startsWith("_")) return; // Don't compare React's internal props.
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
        }
        return value;
    };
};

export default function ResizablePanel({ children, disableOverflow, changeIndicator }: { children: React.ReactNode, disableOverflow?: boolean, changeIndicator?: string }) {
    let [ref, { height }] = useMeasure();

    return (
        <motion.div
            animate={{ height: height || "auto" }}
            className={`relative w-full ${disableOverflow ? `` : `overflow-hidden`}`}
        >
            <AnimatePresence initial={false}>
                <motion.div
                    key={changeIndicator ?? JSON.stringify(children, ignoreCircularReferences())}
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                >
                    <div
                        ref={ref}
                        className={`${height ? "absolute" : "relative"} w-full`}
                    >
                        {children}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
