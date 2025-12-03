import { browser } from '$app/environment';
import type { PostHog } from 'posthog-js';

/**
 * Execute a callback with the PostHog instance.
 * @param callback - The callback to execute.
 * @example
 * ```ts
 * withPosthog((posthog) => {
 *     posthog.identify('user@example.com');
 * });
 * ```
 */
export async function withPosthog(callback: (posthog: PostHog) => void): Promise<void> {
    if (browser) {
        await import('posthog-js')
            .then(({ default: posthog }) => {
                try {
                    callback(posthog);
                } catch (error) {
                    console.log('Failed to execute analytics callback:', error);
                }
            })
            .catch((error) => {
                console.log('Failed to load PostHog:', error);
            });
    }
}

export function captureEvent(eventName: string, properties?: Record<string, any>) {
    // Only capture events on the client side
    withPosthog((posthog) => {
        posthog.capture(eventName, properties);
    });
}
