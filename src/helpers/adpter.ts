import { Device } from '../plugin/native';


export const Agent = {
    Platform: 'Browser',
    Version: '6.2.0'
};


export const Sites = {
    // baseapi: 'http://crm.cike360.com/'
    //baseapi: 'http://www.cike360.com/school/crm_web/'
    baseapi: 'http://www.cike360.com/PHP_BackGround/'
    // baseapi: 'http://localhost:8101/'
};


export const Package = {
    Domain: 'crm.cike360.com',
    Version: '1.0.0',
    Build: '180208',
    Debug: false
};

//设置平台属性
document.addEventListener('deviceready', () => {
    Agent.Platform = Device.platform;
});

