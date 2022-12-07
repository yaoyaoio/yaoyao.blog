import {defineConfigWithTheme} from "vitepress";
import type {DecThemeConfig} from "../../packages/theme/src/config";
import {getPosts} from "../../packages/theme/src/render";


async function config() {
  return defineConfigWithTheme<DecThemeConfig>({
    title: "YaoYao's Blog",
    description: 'Just playing around.',
    themeConfig: {
      siteTitle: "YaoYao's Blog",
      nav: [
        {text: 'Home', link: '/'},
        {text: 'Archives', link: '/pages/archives'},
        {text: 'About', link: '/pages/about'},
      ],
      footer: {
        message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
        copyright: 'Copyright © 2015-present <a href="https://github.com/yaoyaoio">Yao Yao</a>'
      },
      socialLinks: [
        {icon: 'github', link: 'https://github.com/yaoyaoio/yaoyao.blog'},
      ],
      posts: await getPosts('./'),
      pageSize: 10,
    }
  })
}


export default config()
