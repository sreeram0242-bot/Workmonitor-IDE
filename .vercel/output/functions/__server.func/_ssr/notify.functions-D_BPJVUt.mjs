import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BDx8PeYO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notify.functions-D_BPJVUt.js
var serverSendNotifications = createServerFn({ method: "POST" }).validator((items) => items).handler(createSsrRpc("3a20abb96be728216fcd1ca6c8cb8e283f6391d5c637b055a96340d4214eebc8"));
var fetchNotifications = createServerFn({ method: "GET" }).handler(createSsrRpc("71a72a659f626eee787f895363753763c3a1f50eb2d25e027bf7bee573e193e7"));
var markNotificationsRead = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("140617c1940b9622eeac24ba215f2b81f2191c23ae5264c774096ea21d009644"));
var clearNotifications = createServerFn({ method: "POST" }).handler(createSsrRpc("3ef3e4f44c2fb59f1da38937f52b8bd989a85719d72322c6010f5899719f209a"));
//#endregion
export { serverSendNotifications as i, fetchNotifications as n, markNotificationsRead as r, clearNotifications as t };
