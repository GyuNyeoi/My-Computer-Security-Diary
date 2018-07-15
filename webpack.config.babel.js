import path from 'path'
import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const pathInfo = {
  core: path.resolve(__dirname, 'resources/assets/core'),
  vendor: path.resolve(__dirname, 'assets/vendor'),
  node: path.resolve(__dirname, 'node_modules'),

  source: path.resolve(__dirname, 'resources/assets'), // @DEPRECATED
  user: path.resolve(__dirname, 'resources/assets/core/user'), // @DEPRECATED
  settings: path.resolve(__dirname, 'resources/assets/core/settings'), // @DEPRECATED
  common: path.resolve(__dirname, 'resources/assets/core/common'), // @DEPRECATED
  permission: path.resolve(__dirname, 'resources/assets/core/permission'), // @DEPRECATED
  menu: path.resolve(__dirname, 'resources/assets/core/menu'), // @DEPRECATED
  lang: path.resolve(__dirname, 'resources/assets/core/lang'), // @DEPRECATED
  comp: path.resolve(__dirname, 'resources/assets/core/xe-ui-component') // @DEPRECATED
}

const resolveAlias = {
  // directory
  'xe': pathInfo.core,

  'xeAssets': path.resolve(__dirname, 'assets/'), // @DEPRECATED
  'xe-assets': path.resolve(__dirname, 'resources/assets/'), // @DEPRECATED
  'xe-common': path.resolve(__dirname, 'resources/assets/core/common/js/'), // @DEPRECATED
  'xe-vendor': path.resolve(__dirname, 'assets/vendor/'), // @DEPRECATED
  'xe-component': path.resolve(__dirname, 'assets/core/xe-ui-component/js/'), // @DEPRECATED

  'griper': pathInfo.common + '/js/griper.js', // @DEPRECATED
  'validator': pathInfo.common + '/js/validator.js', // @DEPRECATED

  'xe-transition': pathInfo.comp + '/js/xe-transition.js', // @DEPRECATED
  'xe-dropdown': pathInfo.comp + '/js/xe-dropdown.js', // @DEPRECATED
  'xe-modal': pathInfo.comp + '/js/xe-modal.js', // @DEPRECATED
  'xe-tooltip': pathInfo.comp + '/js/xe-tooltip.js', // @DEPRECATED

  'xe-dynamicLoadManager': pathInfo.common + '/js/dynamicLoadManager.js', // @DEPRECATED
  'xe-utils': pathInfo.core + '/utils/index.js', // @DEPRECATED
  'xe-translator': pathInfo.common + '/js/translator.js', // @DEPRECATED
  'jquery-ui/sortable': pathInfo.node + '/jquery-ui/ui/widgets/sortable.js', // @DEPRECATED
  'jqueryui-nestedsortable': pathInfo.vendor + '/nestedSortable/jquery.mjs.nestedSortable.js' // @DEPRECATED
}

const config = [
  // common, vendor
  {
    entry: {
      'vendor': [
        'babel-polyfill',
        path.resolve(__dirname, 'resources/assets/vendor.js')
      ],
      'common': [path.resolve(__dirname, 'resources/assets/common.js')]
    },
    output: {
      path: path.resolve(__dirname, '.'),
      filename: 'assets/[name].js',
      library: '_xe_bundle_[name]'
    },
    plugins: [
      new webpack.DllPlugin({
        name: '_xe_bundle_[name]',
        path: path.resolve(__dirname, 'resources/assets/[name]-manifest.json')
      }),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ko/), // eslint-disable-line
      new webpack.optimize.CommonsChunkPlugin({
        names: ['common', 'vendor']
      })
    ],
    module: {
      rules: [
        {
          test: /(\.js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
              cacheDirectory: true
            }
          }
        },
        {
          test: require.resolve('jquery'),
          use: [
            {loader: 'expose-loader', options: 'jQuery'},
            {loader: 'expose-loader', options: '$'}
          ]
        }
      ]
    },
    resolve: {
      alias: resolveAlias,
      extensions: ['.js']
    },
    externals: {
      window: 'window'
    }
  },

  // ALL
  {
    entry: {
      'core/common/js/xe.bundle': [
        'babel-polyfill',
        pathInfo.common + '/js/xe.js',
        pathInfo.common + '/js/lang.js',
        pathInfo.common + '/js/progress.js',
        pathInfo.common + '/js/request.js',
        pathInfo.common + '/js/component.js'
      ],

      'core/editor/editor.bundle': [
        pathInfo.core + '/editor/editor.core.js',
        pathInfo.core + '/editor/textarea.define.js'
      ],

      'core/permission/permission.bundle': [
        pathInfo.permission + '/permission.js'
      ],

      'core/lang/langEditorBox.bundle': [pathInfo.lang + '/LangEditorBox.js'],
      'core/common/js/dynamicField': [pathInfo.common + '/js/dynamicField'],
      'core/common/js/storeCategory': [pathInfo.common + '/js/storeCategory.js'],
      'core/user/settings/edit': [pathInfo.user + '/settings/edit.js'],
      'core/settings/js/admin.bundle': [pathInfo.settings + '/js/admin.js'],

      // gulp assets:tree
      // @FIXME
      // @DEPRECATED
      'core/common/js/xe.tree': [pathInfo.core + '/tree/Tree.js']
    },
    output: {
      path: path.resolve(__dirname, '.'),
      filename: 'assets/[name].js'
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          context: path.resolve(__dirname, 'resources/assets/core'),
          from: '**/*',
          to: path.resolve(__dirname, 'assets/core'),
          ignore: [
            '**/*.scss',
            'component.js',
            'index.js',
            'dynamic-load-manager.js',
            'lang.js',
            'singleton.js',
            'common/js/component.js',
            'common/js/draft.js',
            'common/js/dynamicField.js',
            'common/js/dynamicLoadManager.js',
            'common/js/griper.js',
            'common/js/lang.js',
            'common/js/progress.js',
            'common/js/request.js',
            'common/js/storeCategory.js',
            'common/js/translator.js',
            'common/js/utils.js',
            'common/js/validator.js',
            'common/js/xe.js',
            'editor/**/*.js',
            'lang/LangEditorBox.js',
            'permission/*.js',
            'request/**/*.js',
            'router/**/*.js',
            'settings/js/admin.js',
            'tree/**/*.js',
            'user/settings/edit.js',
            'utils/**/*.js'
          ]
        }
      ]),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ko/), // eslint-disable-line
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: path.resolve(__dirname, 'resources/assets/vendor-manifest.json')
      }),
      new webpack.DllReferencePlugin({
        context: '.',
        manifest: path.resolve(__dirname, 'resources/assets/common-manifest.json')
      })
    ],
    module: {
      rules: [
        {
          test: /(\.js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.css$/,
          loaders: [
            {loader: 'file-loader'},
            {loader: 'extract-loader'},
            {loader: 'css-loader'}
          ]
        }
      ]
    },
    resolve: {
      alias: resolveAlias,
      extensions: ['.js']
    },
    externals: {
      window: 'window'
    }
  }
]

export {
  config as default,
  pathInfo,
  resolveAlias
}