import DefaultTheme from 'vitepress/theme'
import {type EnhanceAppContext} from 'vitepress'
import Layout from './Layout.vue'
import Archives from "./components/Archives.vue";
import Home from "./components/Home.vue";
import './styles/custom.css'
import {setPosts} from "./composables/post";


function setupPosts(ctx: EnhanceAppContext) {
  const posts = ctx.siteData.value.themeConfig.posts
  setPosts(ctx.app, posts)
}
export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({app, router, siteData}: EnhanceAppContext) {
    DefaultTheme.enhanceApp({app, router, siteData})
    setupPosts({app, router, siteData})
    app.component('Archives', Archives)
    app.component("Home", Home)
  }
}
