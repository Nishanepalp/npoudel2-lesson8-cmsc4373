import { attachAuthStateChangeObserver } from "./controller/firebase_auth.js";
import { onClickHomeMenu, onClickSharedWithMenu, onClickSignoutMenu } from "./controller/menueventhandlers.js";
import { routing } from "./controller/route_controller.js";

attachAuthStateChangeObserver();
window.onload = function (e) {
//menu button handlers
document.getElementById('menu-home').onclick = onClickHomeMenu;
document.getElementById('menu-shared-with').onclick = onClickSharedWithMenu;
document.getElementById('menu-signout').onclick = onClickSignoutMenu;

    const pathname = window.location.pathname;
    const hash = window.location.hash;
    console.log(pathname, hash);
    routing(pathname, hash);
};

window.onpopstate = function (e) {
    e.preventDefault();
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    routing(pathname, hash);
}