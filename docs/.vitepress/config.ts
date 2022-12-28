import {defineConfigWithTheme} from "vitepress";
import {DecThemeConfig} from "vitepress-theme-december";
import {getPosts} from "./theme/utils/renderPage";


async function config() {
  return defineConfigWithTheme<DecThemeConfig>({
    title: "YaoYao's Blog",
    description: 'Just playing around.',
    head: [
      ['link', {rel: 'icon', href: '/favicon.ico'}]
    ],
    themeConfig: {
      siteTitle: "YaoYao's Blog",
      nav: [
        {text: 'Home', link: '/'},
        {text: 'Archives', link: '/pages/archives'},
        {text: 'About', link: '/pages/about'},
      ],
      algolia:{
        appId: 'CZDQHBIKSR',
        apiKey: '76af0cd40f7c0fc5f78456de2a842849',
        indexName: 'yaoyao',
      },
      footer: {
        message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
        copyright: 'Copyright © 2015-present <a href="https://github.com/yaoyaoio">Yao Yao</a>'
      },
      socialLinks: [
        {icon: 'github', link: 'https://github.com/yaoyaoio/yaoyao.blog'},
      ],
      pageSize: 10,
      posts: await getPosts("./"),
    },
    vite: {
      ssr: {
        noExternal: ["vitepress-theme-december"]
      }
    }

  })
}


export default config()

