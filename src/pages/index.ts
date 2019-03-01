// 模块列表
// --------------------------------------------------
// 请将本目录下所有模块导出，方便从任意地方快速调用
//

import { HomePage } from './home/home';
import { OrderSearchPage } from './home/ordersearch';
import { LoginPage } from './login/login';

// import { ProductsPage } from './products/products';
// import { MeetingPage } from './meeting/meeting';
import { MeetingPage } from './products/meeting';
import { RoomPage } from './products/room';
import { FoodPage } from './products/food';
import { EditFoods } from './products/editfood';
import { WeddingPage } from './products/wedding';
import { WeddingDetailPage } from './products/weddingIframe';
import { ViewsPage } from './show/views';
import { PicsPage } from './show/pics';
import { AddOrderPage } from './home/addorder';
import { FloatMenuPage } from './home/floatMenu';

import { ChartPage } from './charts/chart';
import { clientChartPage } from './charts/client';
import { financeChartPage } from './charts/finance';
import { saleChartPage } from './charts/salechart';
import { targetChartPage } from './charts/target';
import { ordersDataPage } from './charts/orders'

export const Pages = [
	HomePage,
	OrderSearchPage,
	LoginPage,
	ChartPage,
	// ProductsPage,
	MeetingPage,
	RoomPage,
	FoodPage,
	WeddingPage,
	EditFoods,
	ViewsPage,
	PicsPage,
	AddOrderPage,
	FloatMenuPage,
	clientChartPage,
	financeChartPage,
	saleChartPage,
	targetChartPage,
	WeddingDetailPage,
	ordersDataPage
];

export {
	HomePage,
	OrderSearchPage,
	LoginPage,
	ChartPage,
	// ProductsPage,
	MeetingPage,
	RoomPage,
	FoodPage,
	WeddingPage,
	EditFoods,
	ViewsPage,
	PicsPage,
	AddOrderPage,
	FloatMenuPage,
	clientChartPage,
	financeChartPage,
	saleChartPage,
	targetChartPage,
	WeddingDetailPage,
	ordersDataPage
};
