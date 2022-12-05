import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.6ab74304.js";
const __pageData = JSON.parse('{"title":"Hello Everyone","description":"This is a test post","frontmatter":{"title":"Hello Everyone","date":"2022-12-01T00:00:00.000Z","description":"This is a test post"},"headers":[{"level":2,"title":"vitepress-markdown \u7279\u6027","slug":"vitepress-markdown-\u7279\u6027","link":"#vitepress-markdown-\u7279\u6027","children":[{"level":3,"title":"\u8868\u683C","slug":"\u8868\u683C","link":"#\u8868\u683C","children":[]},{"level":3,"title":"\u63D0\u793A","slug":"\u63D0\u793A","link":"#\u63D0\u793A","children":[]},{"level":3,"title":"\u4EE3\u7801\u9AD8\u4EAE","slug":"\u4EE3\u7801\u9AD8\u4EAE","link":"#\u4EE3\u7801\u9AD8\u4EAE","children":[]},{"level":3,"title":"emoji\u8868\u60C5","slug":"emoji\u8868\u60C5","link":"#emoji\u8868\u60C5","children":[]}]}],"relativePath":"posts/hello-everyone.md","xxx":"xxx"}');
const _sfc_main = { name: "posts/hello-everyone.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><p>Hello Everyone!</p><h2 id="vitepress-markdown-\u7279\u6027" tabindex="-1">vitepress-markdown \u7279\u6027 <a class="header-anchor" href="#vitepress-markdown-\u7279\u6027" aria-hidden="true">#</a></h2><h3 id="\u8868\u683C" tabindex="-1">\u8868\u683C <a class="header-anchor" href="#\u8868\u683C" aria-hidden="true">#</a></h3><table><thead><tr><th>Tables</th><th style="${ssrRenderStyle({ "text-align": "center" })}">Are</th><th style="${ssrRenderStyle({ "text-align": "right" })}">Cool</th></tr></thead><tbody><tr><td>col 3 is</td><td style="${ssrRenderStyle({ "text-align": "center" })}">right-aligned</td><td style="${ssrRenderStyle({ "text-align": "right" })}">$1600</td></tr><tr><td>col 2 is</td><td style="${ssrRenderStyle({ "text-align": "center" })}">centered</td><td style="${ssrRenderStyle({ "text-align": "right" })}">$12</td></tr><tr><td>zebra stripes</td><td style="${ssrRenderStyle({ "text-align": "center" })}">are neat</td><td style="${ssrRenderStyle({ "text-align": "right" })}">$1</td></tr></tbody></table><h3 id="\u63D0\u793A" tabindex="-1">\u63D0\u793A <a class="header-anchor" href="#\u63D0\u793A" aria-hidden="true">#</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">::: tip</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">This is a tip</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">:::</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"></span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">::: warning</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">This is a warning</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">:::</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"></span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">::: danger what??</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">This is a dangerous warning</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">:::</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"></span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This is a tip</p></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>This is a warning</p></div><div class="danger custom-block"><p class="custom-block-title">what??</p><p>This is a dangerous warning</p></div><h3 id="\u4EE3\u7801\u9AD8\u4EAE" tabindex="-1">\u4EE3\u7801\u9AD8\u4EAE <a class="header-anchor" href="#\u4EE3\u7801\u9AD8\u4EAE" aria-hidden="true">#</a></h3><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">export</span><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"> </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">default</span><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"> </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">{</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">  </span><span style="${ssrRenderStyle({ "color": "#F07178" })}">name</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">:</span><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}"> </span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span><span style="${ssrRenderStyle({ "color": "#C3E88D" })}">MyComponent</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">&#39;</span><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">  </span><span style="${ssrRenderStyle({ "color": "#676E95" })}">// ...</span></span>
<span class="line"><span style="${ssrRenderStyle({ "color": "#89DDFF" })}">}</span></span>
<span class="line"></span></code></pre></div><h3 id="emoji\u8868\u60C5" tabindex="-1">emoji\u8868\u60C5 <a class="header-anchor" href="#emoji\u8868\u60C5" aria-hidden="true">#</a></h3><div class="language-markdown"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki"><code><span class="line"><span style="${ssrRenderStyle({ "color": "#A6ACCD" })}">:tada: :100:</span></span>
<span class="line"></span></code></pre></div><p>\u{1F389} \u{1F4AF}</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("posts/hello-everyone.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const helloEveryone = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  helloEveryone as default
};
