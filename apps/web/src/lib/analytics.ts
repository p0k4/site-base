// Analytics wrapper supporting Google Analytics and Plausible
// Configured via app.config.ts

import { appConfig } from '../config/appConfig';

type AnalyticsEvent = {
    name: string;
    properties?: Record<string, string | number | boolean>;
};

class Analytics {
    private initialized = false;
    private provider: 'google' | 'plausible' | 'none' = 'none';

    init() {
        if (this.initialized) return;

        const provider = (appConfig as any).ANALYTICS_PROVIDER;
        const id = (appConfig as any).ANALYTICS_ID;

        if (!provider || provider === 'none' || !id) {
            console.log('[Analytics] Disabled - no provider configured');
            return;
        }

        this.provider = provider;

        if (provider === 'google') {
            this.initGoogleAnalytics(id);
        } else if (provider === 'plausible') {
            this.initPlausible(id);
        }

        this.initialized = true;
    }

    private initGoogleAnalytics(measurementId: string) {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
            (window as any).dataLayer.push(args);
        }
        (window as any).gtag = gtag;

        gtag('js', new Date());
        gtag('config', measurementId);

        console.log('[Analytics] Google Analytics initialized');
    }

    private initPlausible(domain: string) {
        // Load Plausible script
        const script = document.createElement('script');
        script.defer = true;
        script.setAttribute('data-domain', domain);
        script.src = 'https://plausible.io/js/script.js';
        document.head.appendChild(script);

        console.log('[Analytics] Plausible initialized');
    }

    trackPageView(path: string) {
        if (!this.initialized) return;

        if (this.provider === 'google' && (window as any).gtag) {
            (window as any).gtag('config', (appConfig as any).ANALYTICS_ID, {
                page_path: path,
            });
        }
        // Plausible tracks page views automatically
    }

    trackEvent(event: AnalyticsEvent) {
        if (!this.initialized) return;

        if (this.provider === 'google' && (window as any).gtag) {
            (window as any).gtag('event', event.name, event.properties);
        } else if (this.provider === 'plausible' && (window as any).plausible) {
            (window as any).plausible(event.name, { props: event.properties });
        }
    }
}

export const analytics = new Analytics();
