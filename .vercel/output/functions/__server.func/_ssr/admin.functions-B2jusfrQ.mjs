import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BDx8PeYO.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-B2jusfrQ.js
var createUserSchema = objectType({
	email: stringType().email(),
	password: stringType().min(6),
	full_name: stringType().min(1),
	position: stringType().min(1),
	role: enumType(["admin", "user"])
});
var createTeamMember = createServerFn({ method: "POST" }).validator((data) => createUserSchema.parse(data)).handler(createSsrRpc("94e3d6b0a5205320fd9ba8db5cb4203f6f544416368229f4eccd00021138b1f3"));
var deleteTeamMember = createServerFn({ method: "POST" }).validator((data) => objectType({ user_id: stringType() }).parse(data)).handler(createSsrRpc("9b121076e029773654de80b83810d59bd4fe46b5997385f0cbf0ee3d2dcc19c9"));
var resetUserPasscode = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("83500b398eff707b81eae12c1712f2d93d12041a42896a6a1ed8647de013d7b9"));
var fetchDevStats = createServerFn({ method: "GET" }).handler(createSsrRpc("e096aa0c9b24bc4cb68d27ed213f9395313d9925db59d34c638c6643b4666dda"));
//#endregion
export { resetUserPasscode as i, deleteTeamMember as n, fetchDevStats as r, createTeamMember as t };
