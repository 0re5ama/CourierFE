import { defineConfig } from '@umijs/max';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
    hash: true,

    targets: {
    },
    // umi routes: https://umijs.org/docs/routing
    routes,
    theme: {
        'root-entry-name': 'variable',
    },
    ignoreMomentLocale: true,
    proxy: proxy[REACT_APP_ENV || 'dev'],
    fastRefresh: true,
    model: {},
    initialState: {},
    layout: {
        locale: true,
        siderWidth: 208,
        ...defaultSettings,
    },
    locale: {
        default: 'en-US',
        antd: true,
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
    },
    antd: {},
    request: {},
    access: {},
    presets: ['umi-presets-pro'],
    openAPI: [
        {
            requestLibPath: "import { request } from '@umijs/max'",
            schemaPath: join(__dirname, 'oneapi.json'),
            mock: false,
        },
        {
            requestLibPath: "import { request } from '@umijs/max'",
            schemaPath:
                'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
            projectName: 'swagger',
        },
    ],
});
