// 模块列表
// --------------------------------------------------
// 请将本目录下所有模块导出，方便从任意地方快速调用
//

import { CalendarDire } from './calendar/calendar';
import { MenuDire } from './menu/menu';
import { ChartMenuDire } from './chartmenu/chartmenu';
import { UploaderDire } from './baseXmb/upload';
import { commonCssDire } from './commonCss/common';



export const Dires = [
	CalendarDire,
	MenuDire,
	ChartMenuDire,
	UploaderDire,
	commonCssDire
];

