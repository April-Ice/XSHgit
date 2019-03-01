import { DeepLinkConfig } from 'ionic-angular';

import * as Pages from './index';


export const RouteConfig: DeepLinkConfig = {
    links: [
        { component: Pages.HomePage, name: 'home', segment: 'home' },
		{ component: Pages.LoginPage, name: 'login', segment: 'login' },
		{ component: Pages.OrderSearchPage, name: 'orders', segment: 'orders' },

		// { component: Pages.ChartPage, name: 'chart', segment: 'chart' },
		{ component: Pages.saleChartPage, name: 'sale', segment: 'chart' },
        { component: Pages.financeChartPage, name: 'finance', segment: 'chart' },
        { component: Pages.clientChartPage, name: 'client', segment: 'chart' },
		{ component: Pages.targetChartPage, name: 'target', segment: 'chart' },
		{ component: Pages.ordersDataPage, name: 'orderdata', segment: 'orderdata' },
        
		// { component: Pages.ProductsPage, name: 'products', segment: 'products' },
		{ component: Pages.FoodPage, name: 'food', segment: 'products' },
        { component: Pages.MeetingPage, name: 'meeting', segment: 'products' },
        { component: Pages.RoomPage, name: 'room', segment: 'products' },
		{ component: Pages.WeddingPage, name: 'wedding', segment: 'products' },

        { component: Pages.WeddingDetailPage, name: 'weddingDetail', segment: 'products/wedding/detail' },
		{ component: Pages.EditFoods, name: 'editfood', segment: 'products/food/editfood' },

        { component: Pages.PicsPage, name: 'pics', segment: 'show/pics' },
		{ component: Pages.ViewsPage, name: 'views', segment: 'show/views' },

        { component: Pages.AddOrderPage, name: 'orderadd', segment: 'home/orderadd' },
        { component: Pages.FloatMenuPage, name: 'floatMenuPage', segment: 'home/floatMenu' },
        // { component: Pages.ListPage, name: 'list', segment: 'list' },
        // { component: Pages.LoginPage, name: 'login', segment: 'reader/setting' },
    ]
};
