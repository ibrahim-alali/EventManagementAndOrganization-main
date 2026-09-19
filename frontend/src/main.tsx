import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {QueryCacheManager} from "./components/common/QueryCacheManager";
import './index.css'

const queryClient = new QueryClient();

declare global {
    interface Window {
        __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
    }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;


// Development only, Run MSW 
if (import.meta.env.DEV) {
    const {worker} = await import("./mocks/browser");
    void worker.start();
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <QueryCacheManager/>
            <App/>
        </QueryClientProvider>
    </StrictMode>,
)
