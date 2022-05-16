import { ModuleCondesnedController } from "./controller/ModuleCondensedController"

export const Routes = [{
    method: "get",
    route: "/users",
    controller: ModuleCondesnedController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: ModuleCondesnedController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: ModuleCondesnedController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: ModuleCondesnedController,
    action: "remove"
}]
