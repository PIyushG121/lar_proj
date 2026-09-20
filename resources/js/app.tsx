import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

const queryClient = new QueryClient();

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function InertiaRoot({ App, props }: { App: any; props: any }) {
    useEffect(() => {
        const syncProps = (newProps: any) => {
            const oldProps = (window as any)._inertia_props;
            (window as any)._inertia_props = newProps;

            if (oldProps) {
                const oldOrgId = oldProps.auth?.user?.current_organization_id;
                const newOrgId = newProps.auth?.user?.current_organization_id;
                const oldUserId = oldProps.auth?.user?.id;
                const newUserId = newProps.auth?.user?.id;

                if (oldOrgId !== newOrgId || oldUserId !== newUserId) {
                    queryClient.invalidateQueries();
                }
            }
        };

        syncProps(props.initialPage.props);

        return router.on('navigate', (event: any) => {
            syncProps(event.detail.page.props);
        });
    }, [props.initialPage.props]);

    return (
        <QueryClientProvider client={queryClient}>
            <App {...props} />
        </QueryClientProvider>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<InertiaRoot App={App} props={props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
