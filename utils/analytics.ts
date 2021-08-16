import firebase from 'firebase/app';
import 'firebase/analytics';

export default class RapidAnalytics {
    private _analytics: firebase.analytics.Analytics;

    constructor(analytics: firebase.analytics.Analytics) {
        this._analytics = analytics;
    }

    public static getInstance(): RapidAnalytics {
        return new RapidAnalytics(firebase.analytics());
    }

    private getAnalyticsProps() {
        return {
            browser: navigator.userAgent,
            isTouch: this.isTouchScreen()
        };
    }

    private isTouchScreen() {
        let hasTouchScreen = false;
        if ('maxTouchPoints' in navigator) {
            hasTouchScreen = navigator.maxTouchPoints > 0;
        } else if ('msMaxTouchPoints' in navigator) {
            hasTouchScreen = navigator.msMaxTouchPoints > 0;
        } else {
            const mQ = window.matchMedia && matchMedia('(pointer:coarse)');
            if (mQ && mQ.media === '(pointer:coarse)') {
                hasTouchScreen = !!mQ.matches;
            } else if ('orientation' in window) {
                hasTouchScreen = true; // deprecated, but good fallback
            } else {
                // Only as a last resort, fall back to user agent sniffing
                const UA = navigator.userAgent;
                hasTouchScreen =
                    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
            }
        }

        return hasTouchScreen;
    }

    public logEvent(key: string, additionalKeys = {}): void {
        this._analytics.logEvent(key, { ...this.getAnalyticsProps(), ...additionalKeys });
    }
}
