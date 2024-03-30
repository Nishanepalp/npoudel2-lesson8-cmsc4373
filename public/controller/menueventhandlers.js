import { homePageView } from "../view/home_page.js";
import { SharedWithPageView } from "../view/sharedwith_page.js";
import { signOutFirebase } from "./firebase_auth.js";
import { routePathnames } from "./route_controller.js";

export function onClickHomeMenu(e) {
    history.pushState(null, null, routePathnames.HOME);
    homePageView();
}

export function onClickSharedWithMenu(e) {
    history.pushState(null, null, routePathnames.SHAREDWITH);
    SharedWithPageView();
}

export async function onClickSignoutMenu(e){
    await signOutFirebase(e);
}