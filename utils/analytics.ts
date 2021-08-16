import firebase from 'firebase/app';
import 'firebase/analytics';
import { noop } from 'lodash';

export default class RapidAnalytics {
    private _analytics: firebase.analytics.Analytics;

    constructor(analytics: firebase.analytics.Analytics) {
        this._analytics = analytics;
    }

    public static getInstance(): RapidAnalytics {
        // Enable analytics only in production mode
        if (process.env.NODE_ENV === 'production') {
            return new RapidAnalytics(firebase.analytics());
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            return {
                logEvent: noop
            };
        }
    }

    private getAnalyticsProps() {
        return {
            browser: navigator.userAgent,
            is_touch: this.isTouchScreen()
        };
    }

    // Source : https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#avoiding_user_agent_detection
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
