// node_modules/vitepress-theme-december/dist/client/index.js
import DefaultTheme from "vitepress/theme";
import Layout from "/Users/liuyao/Documents/note/yaoyao.blog/node_modules/vitepress-theme-december/dist/client/components/Layout.vue";
import Archives from "/Users/liuyao/Documents/note/yaoyao.blog/node_modules/vitepress-theme-december/dist/client/components/Archives.vue";
import Home from "/Users/liuyao/Documents/note/yaoyao.blog/node_modules/vitepress-theme-december/dist/client/components/Home.vue";
import "/Users/liuyao/Documents/note/yaoyao.blog/node_modules/vitepress-theme-december/dist/client/styles/custom.css";
var DecemberTheme = {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    DefaultTheme.enhanceApp({ app, router, siteData });
    app.component("Archives", Archives);
    app.component("Home", Home);
  }
};
var client_default = DecemberTheme;

// node_modules/vitepress-theme-december/dist/index.js
var dist_default = client_default;
export {
  dist_default as default
};
//# sourceMappingURL=vitepress-theme-december.js.map
