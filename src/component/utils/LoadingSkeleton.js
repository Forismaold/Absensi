

export default function LoadingSkeleton({className = 'w-full min-h-[3rem]'}) {
    return <div className={`${className} animate-pulse bg-neutral-300 rounded`}>
    </div>
}