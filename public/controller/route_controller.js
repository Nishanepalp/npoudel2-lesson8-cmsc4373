import { homePageView } from "../view/home_page.js"
import { SharedWithPageView } from "../view/sharedwith_page.js"

export const routePathnames={
    HOME:'/',
    SHAREDWITH:'/sharedwith',
}

export const routes=[
    {path: routePathnames.HOME, page: homePageView},
    {path: routePathnames.MENU2, page: SharedWithPageView},
];

export function routing(pathname, hash){
    const route=routes.find(r=>r.path==pathname);
    if(route){
        if(hash&&hash.length>1){
            route.page(hash.substring(1));
        } else{
            route.page();
        }
        
    } else{
        routes[0].page();
    }
}