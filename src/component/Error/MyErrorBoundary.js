import { ErrorBoundary } from "react-error-boundary";

export default function MyErrorBoundary({children}) {
    return <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        {children}
    </ErrorBoundary>
}

function ErrorFallbackComponent({error}) {
    return <div>
        <h1>Ada yang tidak beres :(</h1>
        <p>Pesan {error.message}</p>
        {error.code && <p>Code: {error.code}</p>}
        <p className="mt-2">{error.stack}</p>
    </div>
}