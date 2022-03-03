const { sidebar } = require("vuepress-auto-sider-utils");

const getBaiduTongji = () => {
  return `
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?0088ce24040b03f2947322ab31d23414";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();
  `;
};

const getBaiduSpa = () => {
  return `
  var _hmt = _hmt || [];
  _hmt.push(['_requirePlugin', 'UrlChangeTracker', {
    shouldTrackUrlChange: function (newPath, oldPath) {
      newPath = newPath.split('#')[0];
      oldPath = oldPath.split('#')[0];
      return newPath != oldPath;
    }}
  ]);
  `;
};

const baiduTongji = getBaiduTongji();
const baiduSpa = getBaiduSpa();
const base = "/";

const nav = [
  { text: "JS方面", link: "/js/" },
  {
    text: "Webpack",
    link: "/webpack/",
  },
  { text: "React", link: "/react/" },
  { text: "汇总", link: "/summary/" },
  // { text: "八股文", link: "/eight-essay/" },
  {
    text: "常见算法",
    link: "/algorithm/",
  },
  {
    text: "性能优化",
    link: "/performance/",
  },
  {
    text: "网络协议",
    link: "/http/",
  },
  {
    text: "CSS",
    link: "/css/",
  },
  {
    text: "QA",
    link: "/face-sutra/",
  },
  { text: "Home", link: "https://link.qdzhou.cn" },
];

module.exports = {
  title: "duangdong的qa",
  description: "前端QA集锦",
  base,
  host: "localhost",
  port: 9202,
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "qd-blog,js,vuepress,leetcode,react,react进阶,css,js进阶,react性能优化,js设计模式",
      },
    ],
    ["script", {}, baiduTongji],
    ["script", {}, baiduSpa],
  ],
  plugins: [
    ["@vuepress/medium-zoom", true],
    ["@vuepress/back-to-top", true],
    ["vuepress-plugin-code-copy", true],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
    [
      "vuepress-plugin-right-anchor",
      {
        showDepth: 3,
        ignore: ["/", "/api/"],
        expand: {
          trigger: "click",
          clickModeDefaultOpen: true,
        },
        customClass: "your-customClass",
        disableGlobalUI: false,
      },
    ],
  ],
  themeConfig: {
    sidebarDepth: 0,
    searchMaxSuggestions: 10,
    lastUpdated: "上次更新",
    editLinks: true,
    smoothScroll: true,
    nav,
    sidebar,
  },
};
