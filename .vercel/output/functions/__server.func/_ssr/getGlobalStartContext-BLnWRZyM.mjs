import { t as getStartContext } from "./async-local-storage-C5fJChCT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/getGlobalStartContext-BLnWRZyM.js
var getGlobalStartContext = () => {
	const context = getStartContext().contextAfterGlobalMiddlewares;
	if (!context) throw new Error(`Global context not set yet, you are calling getGlobalStartContext() before the global middlewares are applied.`);
	return context;
};
//#endregion
export { getGlobalStartContext as t };
