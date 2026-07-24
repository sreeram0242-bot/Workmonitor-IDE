import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BDx8PeYO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings.functions-BjhY51yE.js
var updateProfile = createServerFn({ method: "POST" }).validator((updates) => updates).handler(createSsrRpc("c14bb099578dfe3967b4a82ad6946961511cfbb2e5ca307160fb2c9dfdb697c1"));
var checkPasscode = createServerFn({ method: "POST" }).handler(createSsrRpc("c8e698b2b544849d26207116d9f8ccf9324d4bca11a13a70fb0b74900cd502f0"));
var verifyPasscode = createServerFn({ method: "POST" }).validator((pin) => pin).handler(createSsrRpc("34f1e48d172984cfdb3513394f391495bdb7ee3778de923261ffd83b48a31ba1"));
var updatePasscode = createServerFn({ method: "POST" }).validator((pin) => pin).handler(createSsrRpc("e16604c2f26b21bd79ac71367ca951db78c481dc2be6c57b6b6a9d08f03df3fb"));
//#endregion
export { verifyPasscode as i, updatePasscode as n, updateProfile as r, checkPasscode as t };
