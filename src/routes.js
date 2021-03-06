import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import zzgl from './views/zzgl.vue'
import xxzpgl from './views/xxzp/xxzpgl.vue'
import xxzpglxq from './views/xxzp/xxzpglxq.vue'
import xxzpxqbj from './views/xxzp/xxzpxqbj.vue'
import pggl from './views/pggl/pggl.vue'
import pgjg from './views/pggl/pgjg.vue'
import pgxq from './views/pggl/pgxq.vue'
import xmgl from './views/projectManagement/projectManagementList.vue'
import xmxq from './views/projectManagement/projectManagementListDetail.vue'
import xmxqbj from './views/projectManagement/projectManagementListDetailEdit.vue'
import zcwxxz from './views/PolicyDocumentManagement/policyDocumentManagementListAdd.vue'
import zcwjgl from './views/PolicyDocumentManagement/policyDocumentManagementList.vue'
import zcwjxq from './views/PolicyDocumentManagement/policydocumentManagementListDetail.vue'
import wjgl from './views/QuestionnaireManagement/QuestionnaireManagementList.vue'
import wjgladd from './views/QuestionnaireManagement/QuestionnaireManagementAdd.vue'
import wjgledit from './views/QuestionnaireManagement/QuestionnaireManagementEdit.vue'
import wjgltx from './views/QuestionnaireManagement/QuestionnaireManagementFill.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },


    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/zzgl', component: zzgl, name: '组织管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/zcwxgl', component: zcwjgl, name: '政策文件管理' },
            { path: '/zcwxxz', component: zcwxxz, name: '政策文件新增' },
            { path: '/zcwjxq/:id', component: zcwjxq, name: '政策文件详情' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/pggl', component: pggl, name: '评估管理' },
            { path: '/pgjg/:id', component: pgjg, name: '评估结果' },
            { path: '/pgxq/:id', component: pgxq, name: '评估详情' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/xxzpgl', component: xxzpgl, name: '学校自评管理' },
            { path: '/xxzpglxq/:id', component: xxzpglxq, name: '学校自评详情'},
            { path: '/xxzpxqbj/:id', component: xxzpxqbj, name: '自评信息编辑'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '项目管理',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/xmgl', component: xmgl, name: '项目管理' },
            {
                //项目管理 详情页面
                path: '/xmxq/:id',
                component: xmxq,
                name: '项目详情',
                hidden: true
            },
            {
                //项目管理 详情页面编辑
                path: '/xmxqbj/:id',
                component: xmxqbj,
                name: '项目编辑',
                hidden: true
            },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/wjgl', component: wjgl, name: '问卷管理' },
            { path: '/wjgladd', component: wjgladd, name: '新增问卷管理' },
            { path: '/wjgledit/:id', component: wjgledit, name: '编辑问卷' },
            { path: '/wjgltx/:id', component: wjgltx, name: '问题填写' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;