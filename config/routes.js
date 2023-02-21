/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,title 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                name: 'login',
                path: '/user/login',
                component: './User/Login',
            },
            {
                component: './404',
            },
        ],
    },
    {
        path: '/Welcome',
        name: 'Welcome',
        icon: 'smile',
        component: './Welcome',
    },
    {
        path: '/',
        hideInMenu: true,
        redirect: '/Welcome',
    },
    {
        component: './404',
    },
    {
        name: 'Security',
        icon: 'form',
        path: '/security',
        routes: [
            {
                name: 'Users',
                icon: 'form',
                path: '/security/Users',
                component: './Security/Users',
            },
            {
                name: 'Role',
                icon: 'form',
                path: '/security/role',
                component: './Security/Role',
            },

        ],
    },
    {
        name: 'Settings',
        icon: 'form',
        path: 'setting',
        routes: [
            {
                name: 'Office',
                icon: 'form',
                path: '/setting/office',
                component: './Settings/Office',
            },
        ],
    },

    {
        icon: 'form',
		path: '/ProductTracking',
        routes: [
            {
                name: 'Consignment',
                icon: 'form',
                path: '/ProductTracking/Consignment',
                component: './ProductTracking/Consignment',
            },
            {
                component: "./ProductTracking/ItemGroup",
                icon: "form",
                name: "ItemGroup",
                path: "/ProductTracking/ItemGroup"
            },
            {
                component: "./ProductTracking/ItemList",
                icon: "form",
                name: "ItemList",
                path: "/ProductTracking/ItemList"
            },
            {
                component: "./ProductTracking/ConsignmentRemarks",
                icon: "form",
                name: "ConsignmentRemarks",
                hideInMenu: true,
                path: "/ProductTracking/ConsignmentRemarks"
            },
            {
                component: "./ProductTracking/Checkpoint",
                icon: "form",
                name: "Checkpoints",
                path: "/ProductTracking/Checkpoint"
            },
            {
                component: "./ProductTracking/Container",
                icon: "form",
                name: "Container",
                path: "/ProductTracking/Container"
            },
            {
                component: "./ProductTracking/ContainerList",
                icon: "form",
                name: "ContainerList",
                path: "/ProductTracking/ContainerList"
            },
            {
                component: "./ProductTracking/Package",
                icon: "form",
                name: "Package",
                path: "/ProductTracking/Package"
            },
            {
                component: "./ProductTracking/SearchConsignment",
                icon: "form",
                name: "SearchConsignment",
                path: "/ProductTracking/SearchConsignment"
            },
            {
                component: "./ProductTracking/CheckpointUserDashboard",
                icon: "form",
                name: "CheckpointUserDashboard",
                path: "/ProductTracking/CheckpointUserDashboard"
            },
            {
                component: "./ProductTracking/AdminDashboard",
                icon: "form",
                name: "AdminDashboard",
                path: "/ProductTracking/AdminDashboard"
            },
            {
                component: "./ProductTracking/Payment",
                icon: "form",
                name: "Payment",
                path: "/ProductTracking/Payment"
            },
            {
                component:'./ProductTracking/Item',
                icon:"form",
                name:"Item",
                hideInMenu: true,
                path:'/ProductTracking/Item'
            }

        ],
    },

];
