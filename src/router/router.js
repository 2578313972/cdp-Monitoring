// 导航router
const MenuRouter = () => import('@/views/menu/MenuRouter');
// 概览
const Home = () => import('@/views/overview/Index');

// 监控视图
const DataEngineering = () => import('@/views/monitorUser/dataEngineering'); // 数据工程
const CdpReport = () => import('@/views/monitorUser/cdpReport'); // cdp报表

// 监控配置
const DataEngineeringConfig = () => import('@/views/monitorConfig/dataEngineeringConfig'); // 数据工程配置
const DataEngineeringConfigTable = () => import('@/views/monitorConfig/dataEngineeringConfig/table'); // 数据工程配置--
const EditConfig = () => import('@/views/monitorConfig/editConfig'); // 数据工程配置----编辑

const CdpReportConfig = () => import('@/views/monitorConfig/cdpReportConfig'); // cdp报表监控配置

// 错误页面
const ErrorPage = () => import('@/views/errorPage');


const Routers = {
    path: '/',
    name: 'nav',
    redirect: '/home',
    component: MenuRouter,
    children: [
        {
            path: '/home',
            name: 'home', // 概览
            component: Home
        },
        // 旧CEP活动组件
        // 新CEP活动组件

        {
            path: '/dataEngineering', // 数据工程
            name: 'dataEngineering',
            component: DataEngineering
        },
        {
            path: '/cdpReport', // cdp报表
            name: 'cdpReport',
            component: CdpReport
        },
        {
            path: '/dataEngineeringConfig', // 数据工程配置
            component: DataEngineeringConfig,
            children: [
                {
                    path: '', // 主页
                    name: 'dataEngineeringConfigTable',
                    component: DataEngineeringConfigTable
                },
                {
                    path: 'editConfig', // 编辑
                    name: 'editConfig',
                    component: EditConfig
                }
            ]
        },
        {
            path: '/cdpReportConfig', // cdp报表监控配置
            name: 'cdpReportConfig',
            component: CdpReportConfig
        }

    ]
};

const routers = [
    Routers,
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/error',
        name: 'errorpage',
        component: ErrorPage
    }
];

export default routers;
