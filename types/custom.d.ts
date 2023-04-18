// types/custom.d.ts

declare global {
	interface Window {
		__WB_MANIFEST: any;
	}

	interface ServiceWorkerGlobalScope {
		__WB_MANIFEST: any;
	}
}

export {};
