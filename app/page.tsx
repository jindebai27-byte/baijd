"use client";

import { useEffect, useState } from "react";
import "./portfolio.css";
import BorderGlow from "./BorderGlow";

const projectIndex = [
  { no: "01", slug: "smart-life-botslab", title: "Botslab 家庭安防", sub: "全球化安全产品 / AI 体验 / 智能硬件", tone: "green", image: "/case-studies/botslab-home.png" },
  { no: "02", slug: "h600", title: "H600 行车记录仪", sub: "智能硬件 / 行车安全 / 移动端体验", tone: "blue" },
  { no: "03", slug: "qihang", title: "启航教育", sub: "教育产品 / AI 学习 / 鸿蒙适配", tone: "orange" },
  { no: "04", slug: "other", title: "其他设计", sub: "运营活动 / 品牌视觉 / AIGC 探索", tone: "violet" },
];

const softwareSkills = [
  { key: "ps", name: "Photoshop", detail: "图像合成 · 视觉设计", mark: "Ps" },
  { key: "ae", name: "After Effects", detail: "动态设计 · 影像表达", mark: "Ae" },
  { key: "figma", name: "Figma", detail: "产品设计 · 协作交付", mark: "" },
  { key: "sketch", name: "Sketch", detail: "界面设计 · 组件系统", mark: "" },
  { key: "midjourney", name: "Midjourney", detail: "AIGC 视觉探索", mark: "MJ" },
  { key: "codex", name: "Codex", detail: "AI 开发 · 原型落地", mark: ">_" },
];

function useSiteMotion(routeKey: string) {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.toggle("motion-ready", !reduceMotion);

    const revealSelector = [
      ".pf-profile-head > *",
      ".pf-profile-main > *",
      ".pf-timeline > article",
      ".pf-catalog-head > *",
      ".pf-index-row",
      ".pf-cap-head > *",
      ".pf-cap-grid > article",
      ".pf-thanks-main > *",
      ".case-section > *",
      ".case-light .pf-shell > *",
      ".case-analysis > article",
      ".case-feature > *",
      ".case-results > article",
      ".case-end > *",
      ".project-page section article",
      ".project-page section figure",
      ".project-page section [class$='-head']",
      ".project-page section [class$='-heading']",
      ".project-page section [class$='-copy']",
    ].join(",");

    const heroSelector = "#cover, .smart-hero, .h6r-hero, .qh-hero, .ot-hero";
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector))
      .filter((element, index, collection) => collection.indexOf(element) === index)
      .filter((element) => !element.closest(heroSelector));

    elements.forEach((element, index) => {
      element.classList.add("site-reveal");
      element.style.setProperty("--reveal-order", String(index % 4));
      if (element.matches(".pf-index-row, .pf-cap-grid > article, [class$='-grid'] > article, [class$='-methods'] > article, .ot-icon-grid > figure")) element.classList.add("site-lift");
      if (element.matches(".pf-index-row, .ot-icon-grid > figure")) element.classList.add("site-media");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => root.classList.remove("motion-ready");
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      elements.forEach((element) => {
        element.classList.remove("site-reveal", "site-lift", "site-media", "is-visible");
        element.style.removeProperty("--reveal-order");
      });
      root.classList.remove("motion-ready");
    };
  }, [routeKey]);
}

function Arrow() { return <span aria-hidden="true">↗</span>; }

function PhoneScreen({ item, alternate = false }: { item: typeof projectIndex[number]; alternate?: boolean }) {
  const realImage = item.slug === "smart-life-botslab"
    ? (alternate ? "/case-studies/smart-life-home.png" : "/case-studies/botslab-home.png")
    : item.slug === "qihang"
      ? (alternate ? "/case-studies/qihang/qihang-question-bank.png" : "/case-studies/qihang/qihang-home.png")
      : null;
  if (realImage) return <img src={realImage} alt={`${item.title} 产品页面`} />;
  return <div className={`pf-generated-screen ${item.tone} ${alternate ? "is-alternate" : ""}`}><div className="pf-screen-status"><span>9:41</span><i /></div><div className="pf-screen-copy"><small>{item.no} / PORTFOLIO</small><h4>{item.slug === "qihang" ? "AI 学习中心" : "视觉探索集"}</h4><p>{item.slug === "qihang" ? "今日学习任务" : "Selected works"}</p></div><div className="pf-screen-visual"><i /><b>{item.slug === "qihang" ? "AI" : "MORE"}</b></div><div className="pf-screen-cards"><i /><i /><i /></div></div>;
}

function CatalogMockup({ item }: { item: typeof projectIndex[number] }) {
  if (item.slug === "h600") return <div className="pf-mirror-stage h600-catalog-stage"><H600MirrorMockup className="h600-catalog-mirror" src="/case-studies/h600/h600-drive-single.png" alt="H600 后视镜行车记录仪主界面" caption="H600 / 4K LIVE VIEW" /></div>;
  return <div className={`pf-phone-stage ${item.tone}`}><div className="pf-phone pf-phone-back"><span className="pf-phone-side-button" /><span className="pf-dynamic-island" /><div className="pf-phone-screen"><PhoneScreen item={item} alternate /></div></div><div className="pf-phone pf-phone-front"><span className="pf-phone-side-button" /><span className="pf-dynamic-island" /><div className="pf-phone-screen"><PhoneScreen item={item} /></div></div><div className="pf-device-shadow" /></div>;
}

function PortfolioHeader({ detail = false, projectTitle = "", projectTime = "2026" }: { detail?: boolean; projectTitle?: string; projectTime?: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`pf-header ${detail ? "pf-detail-header" : ""} ${scrolled ? "is-scrolled" : ""}`}>
      {detail ? (
        <a className="pf-project-identity" href="/#catalog"><strong>{projectTitle}</strong><small>{projectTime}</small></a>
      ) : (
        <a className="pf-brand" href="#cover"><span>白金德</span><small>PORTFOLIO 2026</small></a>
      )}
      <nav className="pf-home-tabs">
        {detail ? <><a href="/">返回首页</a><a href="#overview">项目概览</a><a href="#pages">页面分析</a><a href="/#catalog">查看其他项目 <Arrow /></a></> : <><a href="#profile">个人经历</a><a href="#catalog">精选项目</a><a href="#capabilities">个人优势</a><a href="#thanks">联系我</a></>}
      </nav>
    </header>
  );
}

function HomePage() {
  const [activeProject, setActiveProject] = useState(0);
  const activeCatalogProject = projectIndex[activeProject];
  return (
    <main className="portfolio-home">
      <PortfolioHeader />
      <section className="pf-cover pf-ai-cover" id="cover">
        <div className="pf-hero-film" aria-hidden="true">
          <video autoPlay muted loop playsInline preload="metadata" poster="/hero-black-cubes-poster.jpg">
            <source src="/hero-black-cubes.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="pf-cover-shade" />
        <div className="pf-cover-inner pf-shell">
          <div className="pf-rail"><span><i /> BAI JINDE / DESIGNER</span><span>视觉 · AI · 品牌</span><span>2026</span></div>
          <div className="pf-ai-copy">
            <h1 style={{ animationDelay: ".2s" }}>BAI JINDE<span> AI</span></h1>
            <h2 style={{ animationDelay: ".4s" }}>UI 设计师 / 视觉设计师 / AI 设计师</h2>
            <p style={{ animationDelay: ".55s" }}>专注于数字产品体验、视觉系统与 AI 创意实践，以清晰的交互逻辑、克制的视觉表达和高效的智能工作流，打造兼具体验品质与商业价值的数字产品。</p>
            <div className="pf-ai-actions" style={{ animationDelay: ".7s" }}>
              <BorderGlow className="pf-action-glow pf-action-primary" edgeSensitivity={34} glowColor="119 65 64" backgroundColor="rgba(4, 234, 0, .11)" borderRadius={5} glowRadius={6} glowIntensity={0.25} coneSpread={8} colors={["#9cff98", "#36d957", "#e6ffe8"]} fillOpacity={0}><a href="#thanks">联系我</a></BorderGlow>
              <BorderGlow className="pf-action-glow pf-action-secondary" edgeSensitivity={34} glowColor="0 0 100" backgroundColor="rgba(255, 255, 255, .055)" borderRadius={5} glowRadius={6} glowIntensity={0.18} coneSpread={8} colors={["#ffffff", "#aebdb9", "#dcecff"]} fillOpacity={0}><a href="#catalog">查看作品</a></BorderGlow>
            </div>
            <small style={{ animationDelay: ".85s" }}>6 年设计经验 · 北京 · 智能家居 / 教育 / 品牌视觉</small>
          </div>
          <div className="pf-cover-foot"><span>PORTFOLIO / 2026</span><p>设计不止于画面，而是连接用户、产品与品牌的完整表达。</p><a href="#profile">向下探索 ↓</a></div>
        </div>
      </section>

      <section className="pf-profile pf-shell" id="profile">
        <div className="pf-page-rail"><span><i /> ABOUT ME</span><span>个人介绍</span><span>25.0%</span></div>
        <div className="pf-profile-head"><h2>关于我<em>About me</em></h2><p>你好，我是白金德，一名拥有 6 年经验的 UI 设计师与 AI 设计实践者。</p></div>
        <div className="pf-profile-main">
          <div className="pf-avatar"><img src="/bai-jinde-portrait.jpg" alt="白金德个人照片" /><span>BAI JINDE / PORTRAIT</span></div>
          <div className="pf-bio"><h3>以体验为核心，<br />让设计真正创造价值。</h3><p>深耕移动端产品设计，覆盖智能家居、教育与社交工具等行业。我将 AI 融入需求评审、视觉探索与交付落地全链路，用数据与反馈驱动设计决策。</p><div className="pf-numbers"><article><strong>06</strong><span>年设计经验</span></article><article><strong>200+</strong><span>组件与图标</span></article><article><strong>40%</strong><span>AI 工作流提效</span></article></div><div className="pf-contact-grid"><a href="mailto:714927114@qq.com"><span>邮箱</span><b>714927114@qq.com</b><Arrow /></a><a href="tel:+8615698402071"><span>电话</span><b>15698402071</b><Arrow /></a><a href="#thanks"><span>所在地</span><b>北京 / 中国</b><Arrow /></a></div><div className="pf-software"><div className="pf-software-head"><span>技能软件</span><small>DESIGN &amp; AI TOOLKIT</small></div><div className="pf-software-grid">{softwareSkills.map((tool) => <article key={tool.key}><span className={`pf-software-icon is-${tool.key}`} aria-hidden="true"><i>{tool.mark}</i></span><div><b>{tool.name}</b><small>{tool.detail}</small></div></article>)}</div></div></div>
        </div>
        <div className="pf-timeline"><article><span>2024—2026</span><h4>360 智慧生活产品线</h4><p>智慧生活 / H600 / Botslab</p></article><article><span>2023—2024</span><h4>启航教育科技</h4><p>教育 APP / AI 学习体系 / 鸿蒙</p></article><article><span>2020—2023</span><h4>浙江迅游科技</h4><p>移动端产品 / 0—1 产品设计</p></article></div>
      </section>

      <section className="pf-catalog pf-shell" id="catalog">
        <div className="pf-page-rail"><span><i /> SELECTED WORK</span><span>作品目录</span><span>50.0%</span></div>
        <div className="pf-catalog-head"><h2>作品目录<em>Contents</em></h2><p>点击目录进入独立项目页面，查看完整设计过程与核心页面分析。</p></div>
        <div className="pf-catalog-showcase">
          <div className="pf-project-menu">
            {projectIndex.map((item, index) => <a className={`pf-project-link ${index === activeProject ? "is-active" : ""}`} href={`/project/${item.slug}`} key={item.slug} onMouseEnter={() => setActiveProject(index)} onFocus={() => setActiveProject(index)} aria-current={index === activeProject ? "true" : undefined}>
              <span>{item.no}.</span><div><h3>{item.title}</h3><p>{item.sub}</p></div><i><Arrow /></i>
            </a>)}
          </div>
          <div className="pf-device-preview" aria-live="polite"><div className="pf-device-meta"><span>{activeCatalogProject.no} / DEVICE PREVIEW</span><small>{activeCatalogProject.slug === "h600" ? "REARVIEW MIRROR" : "IPHONE MOCKUP"}</small></div><CatalogMockup key={activeCatalogProject.slug} item={activeCatalogProject} /></div>
        </div>
      </section>

      <section className="pf-capabilities pf-shell" id="capabilities">
        <div className="pf-page-rail"><span><i /> CAPABILITIES</span><span>个人优势</span><span>75.0%</span></div>
        <div className="pf-cap-head"><h2>思考、创造，<br />并让它真实发生。</h2><p>从策略与研究出发，连接视觉表达、AI 工作流与最终产品落地。</p></div>
        <div className="pf-cap-grid">
          <article><span>01 / VISUAL</span><i>✦</i><h3>视觉叙事与审美判断</h3><p>从概念、情绪到最终画面，建立统一且有辨识度的视觉语言。</p></article>
          <article><span>02 / AI</span><i>⌁</i><h3>AI 驱动的创意生产</h3><p>将生成式 AI 融入研究、发散、制作与迭代，拓展创意边界。</p></article>
          <article><span>03 / BRAND</span><i>◌</i><h3>可持续的品牌系统</h3><p>构建能够持续生长、适配多场景的品牌规范与内容系统。</p></article>
          <article><span>04 / DELIVERY</span><i>↗</i><h3>从策略到落地交付</h3><p>连接商业目标、设计判断与执行，在复杂项目中控制质量。</p></article>
        </div>
      </section>

      <section className="pf-thanks" id="thanks"><div className="pf-shell">
        <div className="pf-page-rail"><span><i /> CONTACT</span><span>联系方式</span><span>100%</span></div>
        <div className="pf-thanks-main"><p>LET'S CREATE SOMETHING MEANINGFUL</p><h2>保持联系</h2><div><span>期待与你一起，<br />创造更好的设计。</span><div className="pf-thanks-links"><a href="mailto:714927114@qq.com">714927114@qq.com <Arrow /></a><a href="tel:+8615698402071">15698402071 <Arrow /></a></div></div></div>
        <footer><span>© 2026 BAI JINDE</span><a href="#cover">回到顶部 ↑</a></footer>
      </div></section>
    </main>
  );
}

function CaseTop({ current, title, subtitle, accent = "#a8ff47" }: { current: string; title: string; subtitle: string; accent?: string }) {
  return <><PortfolioHeader detail projectTitle={title} projectTime="2026" /><div className="case-topbar pf-shell" style={{ "--case-accent": accent } as React.CSSProperties}><span>{current}</span><span>PROJECT CASE STUDY</span><span>2026 PORTFOLIO</span></div><header className="case-cover pf-shell" style={{ "--case-accent": accent } as React.CSSProperties}><p>{subtitle}</p><h1>{title}</h1><div><span>角色 / UI 设计师</span><span>职责 / 体验设计 · 视觉系统 · 交付落地</span><a href="/#catalog">返回目录 <Arrow /></a></div></header></>;
}

function SmartCaseHero() {
  return <>
    <PortfolioHeader detail projectTitle="智慧生活 × Botslab" projectTime="2024—2026" />
    <section className="smart-hero" style={{ "--case-accent": "#00cac4" } as React.CSSProperties}>
      <div className="smart-hero-inner pf-shell">
        <div className="smart-hero-rail"><span><i /> 01 / SMART HOME × BOTSLAB</span><span>PRODUCT EXPERIENCE DESIGN</span><span>2026 PORTFOLIO</span></div>
        <div className="smart-hero-copy">
          <small>SMART HOME · GLOBAL SECURITY · AI EXPERIENCE</small>
          <h1>智慧生活 <em>×</em> Botslab</h1>
          <p>让家庭安全，更快被看见</p>
          <i>Connected Living</i>
        </div>
        <div className="smart-phone-plinth-stage" aria-label="iPhone 13 展示 Botslab 首页">
          <img className="smart-phone-plinth-photo" src="/smart-phone-duo-plinth-hero.png" alt="置于混凝土展台上的智慧生活与 Botslab 双 iPhone 13 产品样机" />
        </div>
        <div className="smart-hero-foot"><span>ROLE / UI DESIGNER</span><span>体验设计 · 视觉系统 · 全球化适配</span><a href="#overview">向下探索 <Arrow /></a></div>
      </div>
    </section>
  </>;
}

function SmartPhoneMockup({ src, alt, className = "", label }: { src: string; alt: string; className?: string; label?: string }) {
  return <figure className={`smart-device ${className}`}>
    <i className="smart-device-side smart-device-side-left" />
    <i className="smart-device-side smart-device-side-right" />
    <div className="smart-device-shell">
      <span className="smart-device-island" />
      <div className="smart-device-screen"><img src={src} alt={alt} /></div>
    </div>
    {label && <figcaption>{label}</figcaption>}
  </figure>;
}

function SmartLifePages() {
  return <>
    <section className="sl-pages-intro" id="pages"><div className="pf-shell">
      <div className="sl-editorial-rail"><span><i /> 05 / SMART LIFE</span><span>CORE PRODUCT PAGES</span><span>68.0%</span></div>
      <div className="sl-pages-heading">
        <div><small>EXISTING PRODUCT EXPERIENCE</small><h2>智慧生活<br /><em>Smart Living</em></h2></div>
        <div className="sl-pages-summary"><b>从首页开始，建立家庭设备的统一视野。</b><p>这一章节聚焦智慧生活现有产品，依次拆解首页信息组织、设备接入入口与 AI 家庭感知。每个画面只保留一个主样机，让页面本身成为视觉焦点。</p></div>
      </div>
      <div className="sl-pages-index"><span>01　首页总览</span><span>02　设备接入</span><span>03　AI 家庭感知</span></div>
    </div></section>

    <section className="sl-feature sl-feature-home"><div className="pf-shell">
      <div className="sl-home-copy">
        <span className="sl-kicker">SMART LIFE · 01 / HOME OVERVIEW</span>
        <h2>一个首页，<br />看清整个家。</h2>
        <p>首页以“家庭空间”而不是“设备清单”组织内容。客厅、卧室等分组承载设备卡片，用户可以先判断设备是否在线，再直接进入实时画面、云录像或设置。</p>
        <div className="sl-analysis-list">
          <article><span>01</span><div><b>空间分组</b><p>用房间建立符合家庭心智的浏览路径</p></div></article>
          <article><span>02</span><div><b>状态前置</b><p>网络、电量与异常状态在卡片层直接可见</p></div></article>
          <article><span>03</span><div><b>高频直达</b><p>实时画面、云录像和设置减少中间跳转</p></div></article>
        </div>
      </div>
      <div className="sl-home-stage">
        <span className="sl-ghost-word">HOME</span>
        <i className="sl-home-aura" />
        <SmartPhoneMockup className="sl-home-phone" src="/case-studies/smart-life-home.png" alt="智慧生活首页产品页面" label="SMART LIFE / HOME" />
        <div className="sl-stage-caption"><span>空间</span><i /><span>设备</span><i /><span>服务</span></div>
      </div>
    </div></section>

    <section className="sl-feature sl-feature-device"><div className="pf-shell">
      <div className="sl-editorial-rail"><span>SMART LIFE · 02</span><span>DEVICE ONBOARDING</span><span>76.0%</span></div>
      <header className="sl-device-head"><div><small>UNIFIED ENTRY</small><h2>把复杂能力，<br />收进一个清晰入口。</h2></div><p>首页右上角的“+”同时承载添加设备、扫码识别与智能场景创建。通过先分流任务、再进入对应流程，避免用户在设备品类和自动化能力之间反复寻找。</p></header>
      <div className="sl-device-stage">
        <div className="sl-device-number">02</div>
        <SmartPhoneMockup className="sl-device-phone" src="/case-studies/smart-add-device.png" alt="智慧生活添加设备入口页面" label="SMART LIFE / ADD" />
        <div className="sl-device-steps">
          <article><span>01</span><b>点击统一入口</b><p>首页固定位置承接新增需求</p></article>
          <article><span>02</span><b>先识别任务类型</b><p>设备、扫码与场景三类入口分层</p></article>
          <article><span>03</span><b>进入专属流程</b><p>减少与当前任务无关的信息干扰</p></article>
        </div>
      </div>
    </div></section>

    <section className="sl-feature sl-feature-ai"><div className="pf-shell">
      <div className="sl-ai-stage">
        <span className="sl-ai-orbit" />
        <span className="sl-ai-word">AI</span>
        <SmartPhoneMockup className="sl-ai-phone" src="/case-studies/smart-life-ai.png" alt="智慧生活 AI 家庭感知首页" label="SMART LIFE / AI HOME" />
      </div>
      <div className="sl-ai-copy">
        <span className="sl-kicker">SMART LIFE · 03 / AI HOME INSIGHT</span>
        <h2>设备不只呈现画面，<br />还要读懂家庭状态。</h2>
        <p>AI 版本首页把区域入侵、闹钟提醒、宠物出现等感知结果前置到设备卡片中，同时保留实时画面、云录像与设置等基础能力。用户不必逐一打开设备，也能快速理解家中发生了什么。</p>
        <div className="sl-ai-metrics">
          <article><strong>01</strong><b>感知结果</b><span>区域入侵 / 闹钟提醒 / 宠物出现</span></article>
          <article><strong>02</strong><b>语音助手</b><span>用自然语言完成查询与控制</span></article>
          <article><strong>03</strong><b>能力分层</b><span>AI 洞察与基础控制互不抢占焦点</span></article>
        </div>
      </div>
    </div></section>

    <section className="sl-next-brand"><div className="pf-shell">
      <span>Next chapter / 02</span><div><h2>Botslab</h2><p>从国内家庭设备管理，进入全球化家庭安防体验</p></div><a href="#botslab-pages" aria-label="进入 Botslab 页面分析">进入章节 <Arrow /></a>
    </div></section>
  </>;
}

function BotslabPages() {
  return <>
    <section className="bl-intro" id="botslab-pages"><div className="pf-shell">
      <div className="bl-rail"><span><i /> 06 / BOTSLAB</span><span>GLOBAL HOME SECURITY</span><span>82.0%</span></div>
      <div className="bl-intro-main">
        <div className="bl-intro-title"><small>PRODUCT EXPERIENCE / 2026</small><h2>Botslab</h2><em>Stay aware, stay secure.</em></div>
        <div className="bl-intro-copy"><b>把设备、事件、服务与购买，组织成一条连续的家庭安防旅程。</b><p>Botslab 面向海外家庭用户，以首页、动态、商城、客服四大功能区构建产品骨架，并通过实时开流承接最核心的查看与处置任务。以下内容使用最新版 Figma 页面，按单主样机的方式拆解每个分区的页面价值与信息组织。</p></div>
      </div>
      <div className="bl-index"><span>01 / 首页 Home</span><span>02 / 动态 Events</span><span>03 / 商城 Shop</span><span>04 / 客服 Support</span><span>05 / 开流 Live</span></div>
    </div></section>

    <section className="bl-section bl-home"><div className="pf-shell">
      <div className="bl-copy">
        <span className="bl-kicker">BOTSLAB · 01 / HOME</span>
        <h2>首页先回答：<br />家里现在安全吗？</h2>
        <p>首页并不只是设备集合，而是用户进入产品后的安全总览。高频布防操作被前置，今日事件形成可扫读的安全报告，设备卡片则同时呈现实时画面、在线状态与异常提醒。</p>
        <div className="bl-points">
          <article><span>01</span><div><b>快捷状态切换</b><p>Switch ON、Switch Off 与 Snooze 降低布撤防成本</p></div></article>
          <article><span>02</span><div><b>今日安全报告</b><p>按人物、车辆、宠物和告警聚合当天变化</p></div></article>
          <article><span>03</span><div><b>设备卡片分级</b><p>把实时画面、离线提醒和功能推荐放在同一浏览路径</p></div></article>
        </div>
      </div>
      <div className="bl-stage bl-home-stage">
        <span className="bl-ghost">HOME</span><i className="bl-aura" />
        <SmartPhoneMockup className="bl-phone bl-home-phone" src="/case-studies/botslab-v2-home.png" alt="Botslab 最新版首页" label="BOTSLAB / HOME" />
        <div className="bl-stage-meta"><span>QUICK ACTION</span><span>SAFETY REPORT</span><span>DEVICE STATUS</span></div>
      </div>
    </div></section>

    <section className="bl-section bl-events"><div className="pf-shell">
      <div className="bl-stage bl-events-stage">
        <span className="bl-ghost">EVENTS</span><i className="bl-aura" />
        <SmartPhoneMockup className="bl-phone bl-events-phone" src="/case-studies/botslab-v2-events.png" alt="Botslab 最新版动态事件页面" label="BOTSLAB / EVENTS" />
        <div className="bl-event-tags"><span>Person</span><span>Car</span><span>Pets</span><span>Alert</span></div>
      </div>
      <div className="bl-copy">
        <span className="bl-kicker">BOTSLAB · 02 / EVENTS</span>
        <h2>动态不是记录堆叠，<br />而是风险判断入口。</h2>
        <p>动态页把摄像机识别结果转化为可以快速判断的事件卡片。缩略画面、风险标签、发生时间、设备来源与人物信息被放在同一阅读单元中，用户无需进入详情即可完成第一次筛选。</p>
        <div className="bl-analysis-grid">
          <article><strong>FILTER</strong><b>按对象筛选</b><p>人物、车辆、宠物与异常类型快速过滤</p></article>
          <article><strong>PRIORITY</strong><b>风险标签前置</b><p>危险、重要与未知状态建立处理优先级</p></article>
          <article><strong>CONTEXT</strong><b>信息上下文完整</b><p>画面、时间、设备和识别对象一起呈现</p></article>
          <article><strong>TIMELINE</strong><b>按日期连续回看</b><p>Today 与 Yesterday 保持事件流的时间感</p></article>
        </div>
      </div>
    </div></section>

    <section className="bl-section bl-shop"><div className="pf-shell">
      <div className="bl-shop-head"><div><span className="bl-kicker">BOTSLAB · 03 / SHOP</span><h2>商城不脱离产品，<br />而是安全能力的延伸。</h2></div><p>商城以品牌活动和核心设备为第一视觉入口，再通过摄像机、门铃、配件与云服务分类承接明确需求。购买入口与设备使用场景保持一致，让用户从“发现问题”自然过渡到“补充能力”。</p></div>
      <div className="bl-shop-stage">
        <div className="bl-shop-word">SHOP</div><i className="bl-shop-glow" />
        <div className="bl-shop-notes">
          <article><span>01</span><b>活动主视觉</b><p>新品、折扣和场景价值同时传达</p></article>
          <article><span>02</span><b>品类快速定位</b><p>设备、配件与订阅服务分层浏览</p></article>
          <article><span>03</span><b>服务持续转化</b><p>从硬件购买延伸到云存储与增值能力</p></article>
        </div>
        <SmartPhoneMockup className="bl-phone bl-shop-phone" src="/case-studies/botslab-v2-shop.png" alt="Botslab 最新版商城首页" label="BOTSLAB / SHOP" />
      </div>
    </div></section>

    <section className="bl-section bl-support"><div className="pf-shell">
      <div className="bl-copy">
        <span className="bl-kicker">BOTSLAB · 04 / SUPPORT</span>
        <h2>客服从回答问题，<br />升级为设备执行助手。</h2>
        <p>安防管家理解用户的自然语言，并基于具体设备状态完成设置调整。对话中明确呈现“理解—确认—执行—反馈”的闭环，同时保留在线客服、说明书与云服务入口，覆盖 AI 无法独立完成的复杂任务。</p>
        <div className="bl-support-flow">
          <span>用户描述问题</span><i>→</i><span>识别设备与意图</span><i>→</i><span>执行并反馈结果</span>
        </div>
        <div className="bl-support-links"><span>在线客服</span><span>说明书</span><span>领取云服务</span></div>
      </div>
      <div className="bl-stage bl-support-stage">
        <span className="bl-ghost">AI</span><i className="bl-aura" />
        <SmartPhoneMockup className="bl-phone bl-support-phone" src="/case-studies/botslab-v2-support.png" alt="Botslab 安防管家智能客服页面" label="BOTSLAB / SECURITY ASSISTANT" />
      </div>
    </div></section>

    <section className="bl-section bl-live"><div className="pf-shell">
      <div className="bl-rail"><span><i /> BOTSLAB · 05 / LIVE</span><span>REAL-TIME SECURITY</span><span>100%</span></div>
      <header className="bl-live-head"><div><small>LIVE STREAM EXPERIENCE</small><h2>画面优先，<br />控制随后。</h2></div><p>实时开流是安防产品最需要稳定感的页面。首屏优先放大直播画面，Live、Cloud 与 SD 明确区分观看模式；缩放、照明、变声、云台和常看位置等进阶能力统一收纳在画面下方。</p></header>
      <div className="bl-live-stage">
        <span className="bl-live-word">REAL TIME</span><i className="bl-live-grid" /><i className="bl-live-glow" />
        <SmartPhoneMockup className="bl-phone bl-live-phone" src="/case-studies/botslab-v2-live.png" alt="Botslab W510 摄像机实时开流页面" label="W510 / LIVE VIEW" />
        <div className="bl-live-notes">
          <article><span>01</span><b>观看模式分层</b><p>Live / Cloud / SD 保持入口稳定</p></article>
          <article><span>02</span><b>高频控制居中</b><p>截图、通话、录制与声音一眼可达</p></article>
          <article><span>03</span><b>进阶能力收纳</b><p>云台、变声、照明与更多减少画面干扰</p></article>
        </div>
      </div>
    </div></section>
  </>;
}

const atlasPages = [
  { src: "/case-studies/botslab-new-home.png", title: "新版首页", en: "New Home", desc: "聚合设备状态、快捷控制与家庭空间，快速建立安全全局视野。" },
  { src: "/case-studies/daily-overview.png", title: "每日概览", en: "Daily Overview", desc: "将全天事件压缩成可扫读的安全摘要，减少逐条查看成本。" },
  { src: "/case-studies/event-feed.png", title: "事件信息流", en: "Event Feed", desc: "用对象、风险等级与时间线组织事件，帮助用户完成首次判断。" },
  { src: "/case-studies/event-timeline.png", title: "事件时间轴", en: "Timeline", desc: "通过日期与时间范围定位录像，让回看从寻找变成快速确认。" },
  { src: "/case-studies/ai-closeup.png", title: "AI 事件详情", en: "AI Detail", desc: "把检测结果、画面证据与设备控制收进同一处置视图。" },
  { src: "/case-studies/cloud-recording.png", title: "云录像", en: "Cloud Record", desc: "结合事件标签与录像片段，支持长期内容检索与证据回溯。" },
  { src: "/case-studies/botslab-empty.png", title: "空状态", en: "Empty State", desc: "在无设备或无内容状态下提供清晰解释和下一步行动入口。" },
];

function InterfaceAtlas() {
  const [active, setActive] = useState(2);
  const page = atlasPages[active];
  return <section className="bl-showroom">
    <div className="pf-shell">
      <div className="bl-ref-rail"><span><i /> 06 / INTERFACE ATLAS ↘</span><span>INTERACTIVE GLASS SHOWROOM</span><span>100%</span></div>
      <header className="bl-showroom-heading">
        <div><small>INTERFACE PANORAMA</small><h2>从页面陈列，进入<br />产品体验展厅。</h2></div>
        <p>七类页面不再同时竞争注意力。移动鼠标查看不同状态，由一个核心画面承载细节，其余页面作为可切换的透明索引，保持完整度与高级感。</p>
      </header>
    </div>
    <div className="bl-showroom-stage">
      <div className="bl-showroom-atmosphere" aria-hidden="true"><img key={page.src} src={page.src} alt="" /></div>
      <div className="bl-showroom-inner">
        <div className="bl-showroom-copy">
          <span className="bl-showroom-count">0{active + 1}<small>/ 07</small></span>
          <p>BOTSLAB / PRODUCT STATE</p>
          <h3>{page.title}</h3>
          <em>{page.en}</em>
          <div className="bl-showroom-rule" />
          <p className="bl-showroom-desc">{page.desc}</p>
          <span className="bl-showroom-hint">HOVER TO EXPLORE　↘</span>
        </div>
        <figure className="bl-showroom-device">
          <span className="bl-showroom-device-light" />
          <img key={page.src} src={page.src} alt={`Botslab ${page.title}页面`} />
          <figcaption><span>BOTSLAB</span><b>{page.en.toUpperCase()}</b></figcaption>
        </figure>
        <div className="bl-showroom-nav" aria-label="选择要查看的产品页面">
          {atlasPages.map((item, index) => <button
            key={item.src}
            type="button"
            className={index === active ? "active" : ""}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            aria-pressed={index === active}
          >
            <span>0{index + 1}</span>
            <img src={item.src} alt="" />
            <div><b>{item.title}</b><small>{item.en}</small></div>
            <i>↗</i>
          </button>)}
        </div>
      </div>
    </div>
  </section>;
}

function BotslabStory() {
  return <>
    <section className="bl-story-intro" id="botslab-overview"><div className="pf-shell">
      <div className="bl-ref-rail"><span><i /> BOTSLAB PRODUCT SYSTEM ↘</span><span>CORE EXPERIENCE</span><span>23.5%</span></div>
      <div className="bl-story-index">
        <div className="bl-story-index-title"><small>从“看见”到“处理”的完整安防路径</small><h2>四大功能区，<br />围绕同一个安全目标。</h2></div>
        <div className="bl-story-route"><span>首页总览</span><i>→</i><span>动态判断</span><i>→</i><span>能力购买</span><i>→</i><span>客服处理</span></div>
      </div>
      <div className="bl-story-metrics">
        <article><span>01</span><b>首页 Home</b><p>家庭状态与高频设备操作的统一入口</p><strong>1</strong><em>个安全总览</em></article>
        <article><span>02</span><b>动态 Events</b><p>识别结果、风险等级与时间线集中呈现</p><strong>5</strong><em>类事件线索</em></article>
        <article><span>03</span><b>商城 Shop</b><p>围绕安防场景补充硬件与订阅能力</p><strong>4</strong><em>类能力扩展</em></article>
        <article><span>04</span><b>客服 Support</b><p>让问题理解、设备执行与结果反馈闭环</p><strong>24h</strong><em>持续服务</em></article>
      </div>
      <blockquote><span>“</span><h3>家庭安防不止是展示设备，<br />而是让用户快速确认、判断并行动。</h3><p>产品信息架构 / 首页 → 动态 → 商城 → 客服 → 实时开流</p></blockquote>
    </div></section>

    <section className="bl-ref-section bl-ref-home"><div className="pf-shell">
      <div className="bl-ref-rail"><span><i /> 01 / HOME OVERVIEW ↘</span><span>SAFETY AT A GLANCE</span><span>38.2%</span></div>
      <header className="bl-ref-heading">
        <div><small>HOME / CORE PAGE</small><h2>进入产品的第一眼，<br />先确认家里是否安全。</h2></div>
        <p>首页用快捷布防、今日事件和设备画面构成安全总览。用户不必逐个进入摄像机，也能先看懂当前状态，再决定下一步操作。</p>
      </header>
      <div className="bl-annotated-stage">
        <div className="bl-guide bl-guide-a" /><div className="bl-guide bl-guide-b" /><div className="bl-guide bl-guide-c" />
        <span className="bl-stage-label label-a">功能导航<br /><small>高频状态快速切换</small></span>
        <span className="bl-stage-label label-b">安全摘要<br /><small>今日变化集中呈现</small></span>
        <span className="bl-stage-label label-c">设备画面<br /><small>在线状态与实时预览</small></span>
        <SmartPhoneMockup className="bl-ref-phone bl-ref-home-phone" src="/case-studies/botslab-v2-home.png" alt="Botslab 首页安全总览页面" label="BOTSLAB / HOME" />
      </div>
      <div className="bl-ref-caption-grid">
        <article><b>快捷状态切换</b><p>Switch ON、Switch Off 与 Snooze 前置，降低布撤防成本。</p></article>
        <article><b>今日安全报告</b><p>人物、车辆、宠物与告警以可扫读的数据摘要出现。</p></article>
        <article><b>设备状态分级</b><p>实时画面、离线提醒和功能推荐处于同一浏览路径。</p></article>
      </div>
    </div></section>

    <section className="bl-ref-section bl-ref-events"><div className="pf-shell">
      <div className="bl-ref-rail"><span><i /> 02 / EVENTS ↘</span><span>RISK RECOGNITION</span><span>52.8%</span></div>
      <header className="bl-ref-heading bl-ref-heading-centered">
        <div><small>EVENTS / USER JUDGEMENT</small><h2>动态不是记录堆叠，<br />而是风险判断入口。</h2></div>
        <p>事件缩略图、识别对象、风险标签、发生时间与设备来源被放在同一阅读单元中，让用户在进入详情前完成第一次筛选。</p>
      </header>
      <div className="bl-floating-stage">
        <span className="bl-floating-word">EVENTS</span>
        <SmartPhoneMockup className="bl-ref-phone bl-ref-events-phone" src="/case-studies/botslab-v2-events.png" alt="Botslab 动态事件页面" label="BOTSLAB / EVENTS" />
        <article className="bl-float-card card-a"><span>01 / FILTER</span><b>对象筛选</b><p>人物、车辆、宠物与异常类型一键过滤。</p></article>
        <article className="bl-float-card card-b"><span>02 / PRIORITY</span><b>风险标签</b><p>危险、重要与未知状态建立处理优先级。</p></article>
        <article className="bl-float-card card-c"><span>03 / CONTEXT</span><b>完整上下文</b><p>画面、时间、设备与识别对象一起呈现。</p></article>
      </div>
    </div></section>

    <section className="bl-ref-section bl-ref-shop"><div className="pf-shell">
      <div className="bl-ref-rail"><span><i /> 03 / SHOP ↘</span><span>SECURITY EXTENSION</span><span>66.4%</span></div>
      <header className="bl-ref-heading">
        <div><small>SHOP / DEVICE & SERVICE</small><h2>商城不是独立频道，<br />而是安全能力的延伸。</h2></div>
        <p>品牌活动和核心设备作为第一视觉入口，摄像机、门铃、配件与云服务继续承接明确需求，让“发现问题”自然过渡到“补充能力”。</p>
      </header>
      <div className="bl-shop-editorial">
        <div className="bl-shop-copyrail"><span>NEW ARRIVAL</span><b>W101</b><p>从主视觉到品类入口，再到云服务推荐，购买动线围绕实际家庭安防场景展开。</p></div>
        <SmartPhoneMockup className="bl-ref-phone bl-ref-shop-phone" src="/case-studies/botslab-v2-shop.png" alt="Botslab 商城首页页面" label="BOTSLAB / SHOP" />
        <div className="bl-shop-side-notes">
          <article><span>01</span><b>活动主视觉</b><p>新品、折扣与场景价值同时传达</p></article>
          <article><span>02</span><b>品类快速定位</b><p>设备、配件与订阅服务分层浏览</p></article>
          <article><span>03</span><b>服务持续转化</b><p>硬件购买延伸至云存储与增值能力</p></article>
        </div>
      </div>
    </div></section>

    <section className="bl-ref-section bl-ref-support"><div className="pf-shell">
      <div className="bl-ref-rail"><span><i /> 04 / SUPPORT ↘</span><span>AI SECURITY ASSISTANT</span><span>80.6%</span></div>
      <header className="bl-ref-heading">
        <div><small>SUPPORT / TASK COMPLETION</small><h2>客服不只回答问题，<br />还要帮助用户完成设置。</h2></div>
        <p>安防管家理解自然语言，识别具体设备和意图，完成设置调整后反馈结果；在线客服、说明书与云服务承接 AI 无法独立处理的任务。</p>
      </header>
      <div className="bl-support-editorial">
        <SmartPhoneMockup className="bl-ref-phone bl-ref-support-phone" src="/case-studies/botslab-v2-support.png" alt="Botslab 安防管家客服页面" label="BOTSLAB / SECURITY ASSISTANT" />
        <div className="bl-support-process">
          <article><span>01</span><b>理解问题</b><p>从自然语言中定位设备、状态与用户意图。</p></article>
          <article><span>02</span><b>确认动作</b><p>将复杂设置翻译成清晰、可确认的操作。</p></article>
          <article><span>03</span><b>执行反馈</b><p>明确告知操作结果，并保留人工服务出口。</p></article>
        </div>
      </div>
    </div></section>

    <section className="bl-ref-section bl-ref-live"><div className="pf-shell">
      <div className="bl-ref-rail"><span><i /> 05 / LIVE STREAM ↘</span><span>REAL-TIME SECURITY</span><span>91.2%</span></div>
      <header className="bl-ref-heading">
        <div><small>LIVE / REAL-TIME CONTROL</small><h2>画面优先，<br />控制围绕当下任务展开。</h2></div>
        <p>直播画面占据视觉中心，Live、Cloud 与 SD 稳定区分观看模式；截图、通话、录制、云台和常看位置按频率分层，避免控制项遮挡核心画面。</p>
      </header>
      <div className="bl-live-editorial">
        <div className="bl-live-horizon" />
        <SmartPhoneMockup className="bl-ref-phone bl-ref-live-phone" src="/case-studies/botslab-v2-live.png" alt="Botslab W510 摄像机实时开流页面" label="W510 / LIVE VIEW" />
        <div className="bl-live-control-map">
          <article><span>SEE</span><b>直播画面</b><p>实时状态与设备名称保持前置</p></article>
          <article><span>LISTEN</span><b>即时沟通</b><p>通话、声音与变声操作集中</p></article>
          <article><span>ACT</span><b>设备控制</b><p>云台、照明和常看位置分层收纳</p></article>
        </div>
      </div>
      <div className="bl-story-ending"><span>覆盖多场景安防需求</span><p>从首页确认状态，到事件判断、设备扩展、问题处理与实时处置，Botslab 让每一步都围绕家庭安全展开。</p></div>
    </div></section>

    <InterfaceAtlas />
  </>;
}

function SmartCaseLegacy() {
  const smartIcons = [
    ["live", "实时画面"], ["cloud", "云录像"], ["settings", "设置"], ["bell", "提醒"], ["ai-lab", "AI Lab"],
    ["search", "搜索"], ["camera", "摄像机控制"], ["scene", "场景"], ["message", "编辑消息"], ["phone", "电话联系"],
  ];
  return <main className="project-page smart-case" style={{ "--case-accent": "#00cac4" } as React.CSSProperties}><SmartCaseHero />
    <section className="smart-intro" id="overview">
      <div className="smart-intro-statement"><div className="pf-shell"><h2><span>Home security becomes</span><span>clear, connected and reassuring.</span></h2><p>让家庭安全状态，更早被看见</p></div></div>
      <div className="smart-intro-body"><div className="pf-shell"><div className="smart-intro-label"><h3>项目简介</h3></div><div className="smart-intro-copy"><p>智慧生活是面向国内家庭用户的智能安防与设备管理产品。围绕摄像机、门铃等多品类设备，将分散的实时画面、异常事件、设备状态与快捷控制重新组织为统一的家庭入口。</p><p>本阶段重点呈现智慧生活现有页面：从首页空间分组、设备接入到 AI 家庭感知，分析产品如何帮助用户用更少操作确认家中状态，并快速进入查看、控制与处置路径。</p></div></div></div>
    </section>
        <section className="smart-process" id="process" aria-labelledby="smart-process-title"><div className="pf-shell">
          <div className="smart-process-rail"><span><i /> 02 / PRODUCT PAGES</span><span>EXISTING PRODUCT MAP</span><span>24.6%</span></div>
          <header className="smart-process-head"><div><h2 id="smart-process-title">智慧生活围绕家庭安防核心场景展开</h2><p>梳理现有页面、核心任务与用户在家庭空间中的使用路径</p></div><span>• 智慧生活页面与功能架构</span></header>
          <div className="smart-process-map">
            <div className="smart-process-phases"><article><b>基础入口</b><span>首页状态　　设备管理</span></article><article><b>核心使用</b><span>事件查看　　实时画面　　录像回看</span></article><article><b>服务延展</b><span>AI 能力　　云服务　　家庭协作</span></article></div>
            <div className="smart-process-flow"><i className="smart-orbit smart-orbit-a" /><i className="smart-orbit smart-orbit-b" /><i className="smart-orbit smart-orbit-c" /><strong className="smart-flow-start">进入</strong><div className="smart-flow-steps">
              <article><p>设备概览<br />家庭状态</p><b>首页</b><small>Home</small></article><article><p>添加设备<br />房间分组</p><b>设备</b><small>Device</small></article><article><p>异常提醒<br />事件分类</p><b>事件</b><small>Event</small></article><article><p>画面查看<br />语音对讲</p><b>实时</b><small>Live</small></article><article><p>录像筛选<br />时间回溯</p><b>回看</b><small>Playback</small></article><article><p>智能摘要<br />内容识别</p><b>AI</b><small>AI Insight</small></article><article><p>云存储<br />增值服务</p><b>服务</b><small>Cloud</small></article><article><p>成员共享<br />账号设置</p><b>我的</b><small>Profile</small></article>
            </div><strong className="smart-flow-end">使用</strong></div>
          </div>
          <div className="smart-process-notes"><article><h3>首页与设备管理</h3><p>首页承担家庭安全总览，集中呈现设备在线状态、重点事件和常用控制；设备页负责添加、分组与能力管理。</p></article><article><h3>事件与实时画面</h3><p>事件页按人物、车辆、宠物与异常类型组织记录；实时页面聚焦查看、对讲、录制和快速处置。</p></article><article><h3>回看、AI 与家庭服务</h3><p>录像回看、AI 摘要与云存储共同降低检索成本，家庭共享与账号设置支持多成员持续使用。</p></article></div>
        </div></section>
    <section className="smart-color-spec" id="color"><div className="pf-shell">
      <div className="smart-color-rail"><span><i /> 03 / VISUAL SYSTEM</span><span>COLOR GUIDELINE</span><span>36.2%</span></div>
      <header className="smart-color-head"><div><h2>设计规范 <em>Design Guidelines</em></h2><p>智慧生活产品规范</p></div><span>品牌识别 · 信息层级 · 状态反馈</span></header>
      <div className="smart-color-layout"><aside><b>Color</b><span>—</span><p>以青绿色建立安全、连接与实时感知的产品心智。</p></aside><div className="smart-color-board">
        <div className="smart-color-swatches"><article className="teal"><b>#00CAC4</b><span>RGB · 0 202 196</span><small>BRAND PRIMARY</small></article><article className="aqua"><b>#6DE3DE</b><span>RGB · 109 227 222</span><small>BRAND LIGHT</small></article><article className="ink"><b>#081514</b><span>RGB · 8 21 20</span><small>INK BACKGROUND</small></article><article className="mist"><b>#E7EFED</b><span>RGB · 231 239 237</span><small>MIST NEUTRAL</small></article></div>
        <div className="smart-color-scene"><i /><i /><div className="smart-color-radius"><b>20px</b></div><div className="smart-color-glass" /></div>
      </div></div>
      <div className="smart-status-colors"><span>FUNCTIONAL COLOR</span><article><i className="online" /><b>在线</b><small>#16C784</small></article><article><i className="notice" /><b>提醒</b><small>#FFB547</small></article><article><i className="alert" /><b>告警</b><small>#FF5F57</small></article><article><i className="offline" /><b>离线</b><small>#9DA7A4</small></article></div>
    </div></section>
    <section className="smart-type-spec" id="type"><div className="pf-shell">
      <div className="smart-type-rail"><span>04 / TYPE & ICON</span><span>TYPOGRAPHY SYSTEM</span><span>52.4%</span></div>
      <div className="smart-type-layout">
        <aside><b>Type</b><span>—</span></aside>
        <div className="smart-type-board">
          <div className="smart-type-scale"><div><span>Regular</span><span>Medium</span><span>Demibold</span><span>Semibold</span><span>Bold</span></div><div><span>12</span><span>14</span><span>16</span><span>20</span><span>24</span><span>28</span><span>32</span><span>36</span></div></div>
          <div className="smart-type-name">MiSans<span>+</span></div>
          <div className="smart-type-note"><span>智慧生活产品界面使用</span><span>中文 / English / 数字</span></div>
          <div className="smart-icon-grid">{smartIcons.map(([name, label]) => <article key={name}><img src={`/case-studies/figma-icons/${name}.svg`} alt={`${label}图标`} /><span>{label}</span></article>)}</div>
        </div>
      </div>
    </div></section>
    <BotslabStory />
    {false && <>
    <section className="smart-pages-intro"><div className="pf-shell">
      <div className="smart-pages-rail"><span><i /> 05 / CORE PRODUCT PAGES</span><span>PAGE ANALYSIS</span><span>68.0%</span></div>
      <div className="smart-pages-heading"><div><small>EXISTING PRODUCT EXPERIENCE</small><h2>先看智慧生活，<br />再进入 Botslab。</h2></div><p>两个品牌分开讲述，不再放进同一画面竞争视觉焦点。先介绍智慧生活的首页与设备接入，再完整展开 Botslab 的首页、事件、实时画面与云录像。</p></div>
    </div></section>

    <section className="smart-showcase smart-showcase-home"><div className="pf-shell">
      <div className="smart-showcase-copy">
        <span className="smart-showcase-no">SMART LIFE · 01 / HOME OVERVIEW</span>
        <h2>首页不是设备列表，<br />而是家庭安全的第一眼。</h2>
        <p>智慧生活首页将家庭空间、设备状态与快捷场景放在同一视野内。用户进入产品后，可以先确认家庭整体状态，再进入具体设备完成查看和控制。</p>
        <ul><li><b>状态先行</b><span>在线、离线与异常状态直接可见</span></li><li><b>事件摘要</b><span>人物、车辆、宠物与告警分类聚合</span></li><li><b>快捷入口</b><span>实时画面、云录像和设置快速触达</span></li></ul>
      </div>
      <div className="smart-home-stage">
        <div className="smart-stage-aura" />
        <SmartPhoneMockup className="smart-home-primary" src="/case-studies/smart-life-home.png" alt="智慧生活首页产品页面" label="SMART LIFE / HOME" />
        <span className="smart-stage-note">家庭空间 · 设备状态 · 快捷场景</span>
      </div>
    </div></section>

    <section className="smart-showcase smart-showcase-device"><div className="pf-shell">
      <header className="smart-showcase-wide-head"><div><span className="smart-showcase-no">SMART LIFE · 02 / DEVICE & ONBOARDING</span><h2>让设备从“被发现”，<br />自然进入家庭空间。</h2></div><p>添加设备页面按照摄像机、门铃和配件等品类组织入口，让用户先识别硬件，再进入对应配网流程，降低多品类设备接入时的选择压力。</p></header>
      <div className="smart-device-gallery smart-device-gallery-single">
        <SmartPhoneMockup className="smart-device-card device-center" src="/case-studies/smart-add-device.png" alt="智慧生活添加设备页面" label="SMART LIFE / ADD DEVICE" />
        <div className="smart-device-index"><span>01</span><b>发现设备</b><i /><span>02</span><b>确认品类</b><i /><span>03</span><b>开始配网</b></div>
      </div>
    </div></section>

    <section className="smart-brand-divider"><div className="pf-shell"><span>02 / GLOBAL HOME SECURITY</span><h2>Botslab</h2><p>面向海外家庭安防场景，以事件理解、实时查看和录像回溯建立完整产品体验。</p></div></section>

    <section className="smart-showcase smart-showcase-events"><div className="pf-shell">
      <div className="smart-events-stage">
        <SmartPhoneMockup className="smart-events-summary smart-botslab-home-phone" src="/case-studies/botslab-home.png" alt="Botslab 首页页面" label="BOTSLAB / HOME" />
      </div>
      <div className="smart-showcase-copy">
        <span className="smart-showcase-no">BOTSLAB · 03 / HOME OVERVIEW</span>
        <h2>先确认状态，<br />再进入具体设备。</h2>
        <p>Botslab 首页通过今日事件摘要、设备画面和在线状态形成安全总览。首页不是简单堆叠摄像机，而是帮助用户快速判断当下是否需要进一步查看。</p>
        <div className="smart-analysis-grid"><article><b>今日重点</b><span>高价值事件集中呈现</span></article><article><b>设备画面</b><span>当前状态直接预览</span></article><article><b>快捷控制</b><span>开关与免打扰快速触达</span></article><article><b>状态反馈</b><span>在线与异常清晰区分</span></article></div>
      </div>
    </div></section>

    <section className="smart-showcase smart-showcase-ai"><div className="pf-shell">
      <div className="smart-showcase-copy">
        <span className="smart-showcase-no">BOTSLAB · 04 / EVENT & AI INSIGHT</span>
        <h2>从一条条录像，<br />变成读得懂的家庭动态。</h2>
        <p>事件页用类型、重要程度与时间组织监控记录；AI 总结把一天内分散的内容转写为可快速浏览的结论，并保留对应录像作为验证依据。</p>
        <div className="smart-analysis-grid"><article><b>分类筛选</b><span>人物 / 车辆 / 宠物</span></article><article><b>风险分级</b><span>危险 / 重要 / 未通知</span></article><article><b>自然语言</b><span>概括发生了什么</span></article><article><b>证据回溯</b><span>结论连接原始录像</span></article></div>
      </div>
      <div className="smart-ai-stage">
        <SmartPhoneMockup className="smart-ai-phone" src="/case-studies/ai-summary.png" alt="Botslab AI 每日事件总结页面" label="BOTSLAB / AI DAILY SUMMARY" />
      </div>
    </div></section>

    <section className="smart-showcase smart-showcase-live"><div className="pf-shell">
      <header className="smart-showcase-wide-head"><div><span className="smart-showcase-no">BOTSLAB · 05 / LIVE VIEW</span><h2>画面优先，操作围绕当下任务展开。</h2></div><p>实时页面以监控画面作为视觉中心，对讲、截图、录制、云台和清晰度等功能按照使用频率分层。重要操作保持单手可达，低频能力收纳进二级入口。</p></header>
      <div className="smart-live-stage">
        <div className="smart-live-grid" />
        <div className="smart-live-copyline"><span>SEE</span><span>LISTEN</span><span>TALK</span><span>ACT</span></div>
        <SmartPhoneMockup className="smart-live-phone" src="/case-studies/w510-live.png" alt="W510 摄像机实时画面页面" label="W510 / LIVE VIEW" />
        <div className="smart-live-features"><article><span>01</span><b>画面查看</b><p>直播画面占据首要视觉区域</p></article><article><span>02</span><b>即时沟通</b><p>对讲与变声能力保持清晰可达</p></article><article><span>03</span><b>设备控制</b><p>云台、照明和常看位置分层组织</p></article></div>
      </div>
    </div></section>

    <section className="smart-showcase smart-showcase-cloud"><div className="pf-shell">
      <div className="smart-showcase-copy">
        <span className="smart-showcase-no">BOTSLAB · 06 / CLOUD PLAYBACK</span>
        <h2>让录像回看，<br />从“寻找”变成“定位”。</h2>
        <p>云录像页面同时承载实时画面、事件列表与 AI 搜索。通过时间、类型、设备和内容线索缩小范围，帮助用户快速定位真正需要确认的片段。</p>
        <ul><li><b>时间定位</b><span>日历与时间轴协同检索</span></li><li><b>事件列表</b><span>缩略图、标签和摘要同时呈现</span></li><li><b>AI 搜索</b><span>用自然语言寻找录像内容</span></li></ul>
      </div>
      <div className="smart-cloud-stage">
        <div className="smart-cloud-orbit" />
        <SmartPhoneMockup className="smart-cloud-main" src="/case-studies/cloud-recording.png" alt="云录像视频集页面" label="CLOUD RECORDING" />
        <span className="smart-cloud-caption">LIVE · CLOUD · SD</span>
      </div>
    </div></section>
    </>}
    <section className="case-section pf-shell"><div className="case-label">06 / 结果与沉淀</div><div className="case-content"><div className="case-results"><article><strong>5 → 3</strong><span>核心路径缩短</span></article><article><strong>+25%</strong><span>首页控制点击率</span></article><article><strong>−40%</strong><span>视觉交付周期</span></article><article><strong>200+</strong><span>图标与组件</span></article></div></div></section><CaseEnd next="H600 行车记录仪" href="/project/h600" />
  </main>;
}

function SmartCase() {
  return <SmartCaseLegacy />;
}

function H600MirrorMockup({
  src,
  alt,
  className = "",
  caption,
}: {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}) {
  return (
    <figure className={`h600-mirror ${className}`}>
      <span className="h600-mirror-mount" aria-hidden="true" />
      <div className="h600-mirror-body">
        <span className="h600-mirror-lens h600-mirror-lens-left" aria-hidden="true" />
        <div className="h600-mirror-display">
          <img src={src} alt={alt} />
        </div>
        <span className="h600-mirror-lens h600-mirror-lens-right" aria-hidden="true" />
        <i className="h600-mirror-glass" aria-hidden="true" />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function H600ScreenShowcase({
  src,
  alt,
  className = "",
  caption,
}: {
  src: string;
  alt: string;
  className?: string;
  caption: string;
}) {
  return (
    <figure className={`h6c-screen ${className}`}>
      <div className="h6c-screen-frame">
        <img src={src} alt={alt} />
        <i aria-hidden="true" />
      </div>
      <figcaption><span>{caption}</span><span>H600 · 1920 × 480 PANORAMIC UI</span></figcaption>
    </figure>
  );
}

function H600SectionRail({
  current,
  title,
  progress,
}: {
  current: string;
  title: string;
  progress: string;
}) {
  return (
    <div className="h600-section-rail">
      <span><i /> {current}</span>
      <span>{title}</span>
      <span>{progress}</span>
    </div>
  );
}

function H600Case() {
  return (
    <main className="project-page h600-page h6r-page h6c-page">
      <PortfolioHeader detail projectTitle="H600 后视镜行车记录仪" projectTime="2024—2026" />

      <section className="h6r-hero">
        <div className="h6r-premium-scene">
          <img className="h6r-premium-photo" src="/case-studies/h600/h600-premium-cockpit.png" alt="" aria-hidden="true" />
          <div className="h6r-premium-screen">
            <img src="/case-studies/h600/h600-drive-panoramic.png" alt="H600 后视镜行车记录仪实时驾驶界面" />
            <i aria-hidden="true" />
          </div>
        </div>
        <div className="h6r-hero-shade" aria-hidden="true" />
        <div className="pf-shell h6r-hero-inner">
          <H600SectionRail current="02 / H600 REARVIEW DASHCAM" title="DRIVING EXPERIENCE DESIGN" progress="PORTFOLIO 2026" />
          <div className="h6r-hero-title">
            <small>SMART MOBILITY · DRIVING SAFETY · HMI EXPERIENCE</small>
            <div className="h6r-hero-name"><h1>H600</h1><em>Drive Guardian</em></div>
            <h2>后视镜行车记录仪</h2>
            <p>看见、预警、记录。把复杂路况压缩进一次抬眼。</p>
          </div>
          <div className="h6r-hero-meta">
            <span>PRODUCT UI / HMI / VISUAL SYSTEM</span>
            <span>1920 × 480 ULTRA-WIDE DISPLAY</span>
            <a href="#h600-overview">VIEW CASE <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="h6z-intro" id="h600-overview">
        <div className="pf-shell">
          <H600SectionRail current="01 / PRODUCT OVERVIEW" title="让驾驶信息回到视线，而不是占据注意力" progress="14%" />
          <div className="h6z-intro-layout">
            <div><span>DRIVE WITH EVIDENCE</span><h2>一块超宽屏，<br />重构抬眼之间的判断。</h2></div>
            <p>H600 将实时路况、三路摄像、ADAS 预警、录像回看与停车守护压缩进后视镜形态。项目以“驾驶信息先于操作”为原则，让道路始终占据主视野，让功能只在需要时出现。</p>
          </div>
          <div className="h6z-specs">
            <article><strong>4 : 1</strong><span>ULTRA-WIDE DISPLAY</span><small>超宽镜面比例</small></article>
            <article><strong>3 CAM</strong><span>MULTI VIEW</span><small>前 / 后 / 车内</small></article>
            <article><strong>4K</strong><span>VIDEO EVIDENCE</span><small>关键录像清晰度</small></article>
            <article><strong>24H</strong><span>PARKING GUARD</span><small>停车持续守护</small></article>
          </div>
        </div>
      </section>

      <section className="h6z-showcase h6z-live" id="pages">
        <div className="pf-shell">
          <header className="h6z-head"><span>01 / REAL-TIME ROAD VIEW</span><h2>路况占据整块视野，<br />操作退到画面边缘。</h2><p>REC、4K、蓝牙、定位与电量保持固定位置；底部控制条只保留驾驶中真正高频的动作。</p></header>
          <div className="h6z-screen-stage"><span className="h6z-ghost" aria-hidden="true">LIVE</span><H600ScreenShowcase src="/case-studies/h600/h600-drive-single.png" alt="H600 实时驾驶主界面" caption="REAL-TIME ROAD VIEW" /></div>
          <div className="h6z-notes"><article><span>01</span><b>状态固位</b><p>关键状态始终处于同一视线区。</p></article><article><span>02</span><b>低干扰控制</b><p>控制层不遮挡道路判断。</p></article><article><span>03</span><b>抬眼可读</b><p>时间与警示强化瞬时识别。</p></article></div>
        </div>
      </section>

      <section className="h6z-showcase h6z-adas">
        <div className="pf-shell">
          <header className="h6z-head is-centered"><span>02 / ADAS SAFETY LANGUAGE</span><h2>危险出现时，<br />只说最重要的事。</h2><p>方向先于文字，危险色集中使用，所有告警始终进入固定视线区。</p></header>
          <div className="h6z-screen-stage"><span className="h6z-ghost" aria-hidden="true">WARNING</span><H600ScreenShowcase src="/case-studies/h600/h600-lane-warning.png" alt="H600 ADAS 车道偏离预警界面" caption="LANE DEPARTURE WARNING" /></div>
          <div className="h6z-tags"><span>车距过近</span><span>车道偏离</span><span>行人碰撞</span><span>前车起步</span></div>
        </div>
      </section>

      <section className="h6z-showcase h6z-multicam">
        <div className="pf-shell">
          <header className="h6z-head is-split"><div><span>03 / MULTI-CAMERA</span><h2>ONE MIRROR.<br />THREE POINTS OF VIEW.</h2></div><p>单屏专注当前路况，双屏同时对照前后画面，三屏补充车内状态。不同模式沿用一致的状态区与控制区。</p></header>
          <div className="h6z-screen-stage is-wide"><H600ScreenShowcase src="/case-studies/h600/h600-drive-dual.png" alt="H600 前后双路摄像画面" caption="DUAL VIEW / FRONT · REAR · CABIN" /></div>
          <div className="h6z-mode-line"><span>SINGLE VIEW</span><b>DUAL VIEW</b><span>TRIPLE VIEW</span></div>
        </div>
      </section>

      <section className="h6z-showcase h6z-playback">
        <div className="pf-shell">
          <header className="h6z-head is-split"><div><span>04 / EVIDENCE PLAYBACK</span><h2>从“文件列表”，<br />回到“事故现场”。</h2></div><p>录像按循环、紧急、停车监控、延时与抓拍重新组织。先按场景缩小范围，再进入具体时间。</p></header>
          <div className="h6z-screen-stage is-left"><H600ScreenShowcase src="/case-studies/h600/h600-playback.png" alt="H600 录像回看与证据分类页面" caption="PLAYBACK / RECORDING LIBRARY" /><aside><b>SCENE FIRST</b><span>按任务建立入口</span><b>FAST RECALL</b><span>关键录像独立呈现</span></aside></div>
        </div>
      </section>

      <section className="h6z-showcase h6z-settings">
        <div className="pf-shell">
          <header className="h6z-head is-right"><span>05 / SYSTEM CONTROL</span><h2>复杂参数，<br />收纳成清晰控制面板。</h2><p>功能分组采用统一图标语言；亮度与音量保留直接滑杆，青色只用于当前状态。</p></header>
          <div className="h6z-screen-stage is-right"><H600ScreenShowcase src="/case-studies/h600/h600-settings.png" alt="H600 系统设置与设备控制页面" caption="SYSTEM SETTINGS / DEVICE CONTROL" /></div>
          <div className="h6z-system-keys"><span>FUNCTION GROUP</span><span>LINEAR ICONS</span><span>DIRECT CONTROL</span></div>
        </div>
      </section>

      <section className="h6z-gallery">
        <div className="pf-shell">
          <header className="h6z-head is-centered"><span>06 / COMPLETE SYSTEM</span><h2>更多页面，构成完整的驾驶守护。</h2><p>相册、哨兵监控与多路画面在统一视觉系统中保持清晰层级。</p></header>
          <div className="h6z-gallery-grid">
            <figure className="is-main"><img src="/case-studies/h600/h600-sentry.png" alt="H600 哨兵模式页面" /><figcaption>SENTRY MODE / 01</figcaption></figure>
            <figure><img src="/case-studies/h600/h600-album.png" alt="H600 相册页面" /><figcaption>ALBUM / 02</figcaption></figure>
            <figure><img src="/case-studies/h600/h600-drive-dual.png" alt="H600 双屏驾驶页面" /><figcaption>DUAL VIEW / 03</figcaption></figure>
          </div>
          <div className="h6z-footer"><span>H600 / REARVIEW DASHCAM</span><span>UI DESIGN · VISUAL SYSTEM · HMI</span><span>2024—2026</span></div>
        </div>
      </section>

      <CaseEnd next="启航教育" href="/project/qihang" />
    </main>
  );
}

function QihangPhone({
  src,
  alt,
  className = "",
  label,
}: {
  src: string;
  alt: string;
  className?: string;
  label?: string;
}) {
  return (
    <figure className={`qh-phone ${className}`}>
      <div className="qh-phone-shell">
        <span className="qh-phone-speaker" aria-hidden="true" />
        <span className="qh-phone-button qh-phone-button-one" aria-hidden="true" />
        <span className="qh-phone-button qh-phone-button-two" aria-hidden="true" />
        <div className="qh-phone-screen"><img src={src} alt={alt} /></div>
      </div>
      {label && <figcaption>{label}</figcaption>}
    </figure>
  );
}

function QihangRail({ index, progress }: { index: string; progress: string }) {
  return (
    <div className="qh-rail">
      <span><i /> {index}</span>
      <span>QIHANG EDUCATION · PRODUCT EXPERIENCE DESIGN</span>
      <span><b /> {progress}</span>
    </div>
  );
}

function QihangCase() {
  return (
    <main className="project-page qh-page">
      <PortfolioHeader detail projectTitle="启航教育 APP" projectTime="2023—2024" />

      <section className="qh-hero">
        <div className="qh-hero-light qh-hero-light-one" aria-hidden="true" />
        <div className="qh-hero-light qh-hero-light-two" aria-hidden="true" />
        <div className="pf-shell qh-hero-inner">
          <QihangRail index="03 / QIHANG EDUCATION" progress="06.8%" />
          <div className="qh-hero-poster">
            <img src="/case-studies/qihang/qihang-hero-hand-v2.png" alt="手持手机展示启航教育 APP 首页" />
            <div className="qh-hero-poster-copy">
              <span>EDTECH · AI LEARNING · GROWTH EXPERIENCE</span>
              <div className="qh-hero-poster-title"><h1>启航教育 APP</h1><em>Learning Journey</em></div>
              <p>将课程、题库、学习服务与 AI 辅助整合进同一条备考路径</p>
            </div>
          </div>
          <div className="qh-hero-foot"><span>BAI JINDE / UI DESIGNER</span><span>COURSE · PRACTICE · SERVICE · GROWTH</span><a href="#overview">向下探索 ↓</a></div>
        </div>
      </section>

      <section className="qh-intro" id="overview">
        <div className="pf-shell">
          <QihangRail index="01 / PROJECT OVERVIEW" progress="12.6%" />
          <header className="qh-overview-heading">
            <span aria-hidden="true" />
            <div><h2><i>P</i>roject <em>Overview</em></h2><p>项目概览</p></div>
          </header>
          <div className="qh-overview-copy">
            <article>
              <h3>它的目标：打造“一站式”的考研备考生态</h3>
              <ul>
                <li>首页聚合精选课程、公开课、备考工具与阶段活动，帮助用户快速确认当前最重要的学习任务。</li>
                <li>学习、题库、发现与个人中心形成稳定的五栏结构，覆盖内容获取、学习执行、练习反馈和服务承接。</li>
                <li>课程、电子书、专项练习和 AI 辅助共享统一的视觉语言，减少跨场景使用时的认知切换。</li>
                <li>会员权益与课程商品承接商业转化，同时保持学习路径与服务体验的连续性。</li>
              </ul>
            </article>
            <article>
              <h3>它的玩法：内容如何驱动完整学习生态？</h3>
              <p>用户从首页发现内容，通过学习中心继续课程，在题库完成训练与反馈，再由发现、AI 助手和会员服务承接不同阶段的个性化需求。</p>
              <div className="qh-overview-map">
                <span>精选课程 <b>建立学习目标</b></span>
                <span>题库训练 <b>反馈掌握程度</b></span>
                <span>AI 助手 <b>解决个性问题</b></span>
                <span>会员服务 <b>延长学习周期</b></span>
              </div>
            </article>
          </div>
          <div className="qh-overview-stage">
            <div className="qh-overview-path" aria-label="启航教育核心学习路径">
              <span><b>01</b><em>发现内容</em></span>
              <span><b>02</b><em>开始学习</em></span>
              <span><b>03</b><em>练习反馈</em></span>
              <span><b>04</b><em>服务承接</em></span>
            </div>
            <div className="qh-overview-statement">
              <span aria-hidden="true" />
              <small>DESIGN PRINCIPLE</small>
              <strong>把复杂的备考，组织成一条可持续推进的学习路径。</strong>
            </div>
            <div className="qh-overview-metrics">
              <article><strong>05</strong><span>核心导航</span><small>CORE MODULES</small></article>
              <article><strong>08</strong><span>体验章节</span><small>KEY SCENARIOS</small></article>
              <article><strong>01</strong><span>学习闭环</span><small>LEARNING LOOP</small></article>
            </div>
            <div className="qh-overview-device">
              <QihangPhone src="/case-studies/qihang/qihang-home.png" alt="启航教育 APP 首页" className="qh-phone-overview" label="QIHANG EDUCATION / HOME" />
            </div>
            <div className="qh-overview-plinth" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="qh-chapter qh-learning" id="pages">
        <div className="pf-shell">
          <QihangRail index="02 / LEARNING SYSTEM" progress="24.2%" />
          <header className="qh-chapter-head">
            <div><small>学习中心 / 电子书</small><h2>让“继续学习”<br />始终近在眼前。</h2></div>
            <p>课程与电子书不再是两套孤立内容。学习时长、最近阅读和高频工具集中在同一视线区，用户返回页面后可以迅速恢复上一次的学习状态。</p>
          </header>
          <div className="qh-learning-stage">
            <span className="qh-outline-word" aria-hidden="true">LEARN</span>
            <div className="qh-learning-copy">
              <article><span>01</span><h3>状态延续</h3><p>学习时长与最近内容成为页面首要信息，降低再次进入成本。</p></article>
              <article><span>02</span><h3>双内容形态</h3><p>课程、电子书共享结构语言，同时保留各自的阅读与观看反馈。</p></article>
              <article><span>03</span><h3>轻量工具</h3><p>背单词和听力入口靠近内容区域，形成学习后的自然延伸。</p></article>
            </div>
            <QihangPhone src="/case-studies/qihang/qihang-study.png" alt="启航教育学习中心与电子书页面" className="qh-phone-learning" label="LEARNING HUB / E-BOOK" />
          </div>
        </div>
      </section>

      <section className="qh-chapter qh-practice">
        <div className="pf-shell">
          <QihangRail index="03 / PRACTICE LOOP" progress="36.0%" />
          <header className="qh-chapter-head qh-chapter-head-split">
            <div><small>题库 / 学习反馈</small><h2>从做题数量，<br />看见真实进步。</h2></div>
            <p>题库首页先呈现今日做题、累计题量与正确率，再进入专项练习。数据不只是装饰，而是帮助用户判断学习状态并决定下一步训练内容。</p>
          </header>
          <div className="qh-practice-stage">
            <div className="qh-practice-metrics">
              <article><strong>16</strong><span>累计练习题</span></article>
              <article><strong>33.32%</strong><span>阶段正确率</span></article>
              <article><strong>03</strong><span>核心专项</span></article>
            </div>
            <QihangPhone src="/case-studies/qihang/qihang-question-bank.png" alt="启航教育题库与专项练习页面" className="qh-phone-practice" label="QUESTION BANK / PRACTICE DATA" />
            <div className="qh-practice-note">
              <span>DATA-DRIVEN FEEDBACK</span>
              <h3>先给结论，<br />再进入训练。</h3>
              <p>核心指标与练习入口分层呈现，降低高信息密度带来的判断压力。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="qh-chapter qh-discovery">
        <div className="pf-shell">
          <QihangRail index="04 / CONTENT DISCOVERY" progress="47.5%" />
          <header className="qh-chapter-head">
            <div><small>发现 / 备考工具</small><h2>把分散资源，<br />组织成可行动的内容。</h2></div>
            <p>“发现”承接公开课、经验问答和备考资讯。首屏先以工具卡片建立高频入口，再以课程列表承接持续浏览，让内容消费与实际学习自然衔接。</p>
          </header>
          <div className="qh-discovery-stage">
            <div className="qh-discovery-glow" aria-hidden="true" />
            <div className="qh-discovery-index">
              <span>01 / 考研工具</span><span>02 / 公开课</span><span>03 / 学长学姐</span><span>04 / 精选问答</span>
            </div>
            <QihangPhone src="/case-studies/qihang/qihang-discover.png" alt="启航教育发现与公开课页面" className="qh-phone-discovery" label="DISCOVER / OPEN COURSES" />
            <div className="qh-discovery-caption"><b>CONTENT TO ACTION</b><p>从“浏览内容”到“开始学习”，入口不跨层级、不打断。</p></div>
          </div>
        </div>
      </section>

      <section className="qh-chapter qh-membership">
        <div className="pf-shell">
          <QihangRail index="05 / MEMBERSHIP SYSTEM" progress="60.8%" />
          <header className="qh-chapter-head qh-chapter-head-split">
            <div><small>个人中心 / 会员体系</small><h2>权益不是清单，<br />而是一套成长分层。</h2></div>
            <p>个人中心承担学习数据、订单服务与会员转化。基础会员和高阶特权卡使用一致框架，通过色彩、权益数量和专属标签建立清晰的价值梯度。</p>
          </header>
          <div className="qh-membership-stage">
            <span className="qh-membership-ring" aria-hidden="true" />
            <QihangPhone src="/case-studies/qihang/qihang-membership-star.png" alt="启航教育星耀直通卡页面" className="qh-phone-member qh-phone-member-left" label="STAR MEMBERSHIP" />
            <QihangPhone src="/case-studies/qihang/qihang-profile.png" alt="启航教育个人中心页面" className="qh-phone-member qh-phone-member-center" label="PROFILE CENTER" />
            <QihangPhone src="/case-studies/qihang/qihang-membership-privilege.png" alt="启航教育研力特权卡页面" className="qh-phone-member qh-phone-member-right" label="PREMIUM PRIVILEGE" />
          </div>
          <div className="qh-membership-features">
            <article><span>01</span><b>价值可见</b><p>把课程、练习、批改和优惠权益翻译为可比较的用户价值。</p></article>
            <article><span>02</span><b>层级清晰</b><p>暖金与深黑建立会员等级，统一框架降低理解成本。</p></article>
            <article><span>03</span><b>转化连续</b><p>权益说明、活动价格和行动按钮固定在同一决策路径中。</p></article>
          </div>
        </div>
      </section>

      <section className="qh-chapter qh-ai">
        <div className="pf-shell">
          <QihangRail index="06 / AI ASSISTANT" progress="72.4%" />
          <div className="qh-ai-layout">
            <div className="qh-ai-copy">
              <small>启小航 AI / 学习辅助</small>
              <h2>让复杂问题，<br />先得到一个清晰入口。</h2>
              <p>AI 助手以推荐问题降低首次提问门槛，并将择校、作文批改、答疑和单词学习整合为可切换的能力入口。它不是独立功能，而是贯穿备考过程的服务触点。</p>
              <div className="qh-ai-prompts"><span>院校选择</span><span>专业规划</span><span>作文批改</span><span>知识答疑</span></div>
            </div>
            <div className="qh-ai-device">
              <span className="qh-ai-halo" aria-hidden="true" />
              <QihangPhone src="/case-studies/qihang/qihang-ai-assistant.png" alt="启航教育启小航 AI 助手页面" className="qh-phone-ai" label="QIHANG AI / STUDY ASSISTANT" />
              <div className="qh-ai-float qh-ai-float-one">WHAT IS MY<br />NEXT STEP?</div>
              <div className="qh-ai-float qh-ai-float-two">AI WRITING<br />REVIEW</div>
            </div>
          </div>
        </div>
      </section>

      <section className="qh-chapter qh-growth">
        <div className="pf-shell">
          <QihangRail index="07 / GROWTH & COMMERCE" progress="84.1%" />
          <header className="qh-chapter-head">
            <div><small>活动激励 / 课程转化</small><h2>从参与，到持续学习，<br />每一步都有明确回报。</h2></div>
            <p>任务闯关用阶段进度与奖励降低长期备考的疲惫感；课程详情则通过试听、权益、价格与购买行动建立完整决策链路，连接运营活动与商业转化。</p>
          </header>
          <div className="qh-growth-stage">
            <div className="qh-growth-panel qh-growth-panel-blue">
              <div><span>ENGAGEMENT</span><h3>暑期闯关</h3><p>阶段任务、积分奖励与排名反馈共同建立持续参与动力。</p></div>
              <QihangPhone src="/case-studies/qihang/qihang-checkin.png" alt="启航教育暑期闯关活动页面" className="qh-phone-growth" label="SUMMER CHECK-IN" />
            </div>
            <div className="qh-growth-panel qh-growth-panel-orange">
              <QihangPhone src="/case-studies/qihang/qihang-course-detail.png" alt="启航教育课程商品详情页面" className="qh-phone-growth" label="COURSE COMMERCE" />
              <div><span>CONVERSION</span><h3>课程详情</h3><p>试听内容、价格权益和购买动作在同一条纵向路径中连续出现。</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="qh-system">
        <div className="pf-shell">
          <QihangRail index="08 / SERVICE TOUCHPOINTS" progress="94.6%" />
          <div className="qh-system-layout">
            <div className="qh-system-copy">
              <small>消息中心 / 服务闭环</small>
              <h2>学习之外，<br />服务仍然保持连续。</h2>
              <p>系统通知、活动、订单物流、批改、答疑与课程消息按任务类型分组。用户无需理解后台组织方式，也能快速判断信息优先级和后续动作。</p>
              <ul><li><b>07</b><span>消息类型</span></li><li><b>01</b><span>统一入口</span></li><li><b>24H</b><span>服务连接</span></li></ul>
            </div>
            <div className="qh-system-device">
              <span className="qh-system-grid" aria-hidden="true" />
              <QihangPhone src="/case-studies/qihang/qihang-messages.png" alt="启航教育消息中心页面" className="qh-phone-system" label="MESSAGE CENTER / SERVICE LOOP" />
            </div>
          </div>
          <footer className="qh-project-footer"><span>QIHANG EDUCATION APP</span><span>UI DESIGN · EXPERIENCE SYSTEM · AI LEARNING</span><span>2023—2024</span></footer>
        </div>
      </section>

      <CaseEnd next="其他设计" href="/project/other" />
    </main>
  );
}

function OtherPhone({ src, alt, className = "", label }: { src: string; alt: string; className?: string; label?: string }) {
  return <figure className={`ot-phone ${className}`}>
    <i className="ot-phone-key ot-phone-key-a" />
    <i className="ot-phone-key ot-phone-key-b" />
    <div className="ot-phone-shell">
      <span className="ot-phone-island" />
      <div className="ot-phone-screen"><img src={src} alt={alt} /></div>
    </div>
    {label && <figcaption>{label}</figcaption>}
  </figure>;
}

function QihangArtwork({ src, alt, label, className = "" }: { src: string; alt: string; label: string; className?: string }) {
  return <figure className={`ot-qh-art ${className}`}>
    <div className="ot-qh-art-media"><img src={src} alt={alt} loading="lazy" /></div>
    <figcaption><span>{label}</span><i /></figcaption>
  </figure>;
}

function CampaignBrief({
  goal,
  strategy,
  touchpoints,
}: {
  goal: [string, string];
  strategy: [string, string];
  touchpoints: [string, string];
}) {
  return <div className="ot-qh-brief" aria-label="活动设计分析">
    <article><small>01 / CAMPAIGN GOAL</small><b>{goal[0]}</b><p>{goal[1]}</p></article>
    <article><small>02 / VISUAL STRATEGY</small><b>{strategy[0]}</b><p>{strategy[1]}</p></article>
    <article><small>03 / DELIVERABLES</small><b>{touchpoints[0]}</b><p>{touchpoints[1]}</p></article>
  </div>;
}

function OtherCase() {
  return <main className="project-page ot-page" style={{ "--case-accent": "#ff654d" } as React.CSSProperties}>
    <PortfolioHeader detail projectTitle="其他设计" projectTime="2022—2026" />

    <section className="ot-hero">
      <div className="pf-shell ot-hero-inner">
        <div className="ot-rail"><span><i /> 04 / OTHER DESIGN</span><span>CAMPAIGN · COMMERCE · VISUAL</span><span>2026 PORTFOLIO</span></div>
        <div className="ot-hero-copy">
          <small>SELECTED VISUAL & OPERATION WORK</small>
          <h1>其他<br /><em>设计</em></h1>
          <p>运营活动、增值服务与品牌视觉探索。<br />让每一次触点既有清晰目标，也保留足够的视觉记忆。</p>
        </div>
        <div className="ot-hero-stage" aria-label="其他设计代表页面组合">
          <span className="ot-hero-orbit" aria-hidden="true" />
          <OtherPhone src="/case-studies/other/outing-season.png" alt="踏青季云录像运营活动页面" className="is-left" label="OUTING SEASON / CLOUD SERVICE" />
          <OtherPhone src="/case-studies/other/spring-flip-full.png" alt="春节云录像翻牌礼活动页面" className="is-center" label="SPRING FESTIVAL / FLIP CAMPAIGN" />
          <OtherPhone src="/case-studies/other/lucky-draw.png" alt="幸运大抽奖活动页面" className="is-right" label="LUCKY DRAW / ENGAGEMENT" />
        </div>
        <div className="ot-hero-foot"><span>ROLE / UI & VISUAL DESIGNER</span><span>活动策划 · 视觉设计 · 体验转化</span><a href="#overview">向下探索 <Arrow /></a></div>
      </div>
    </section>

    <section className="ot-overview" id="overview">
      <div className="pf-shell">
        <div className="ot-section-rail"><span>01 / PROJECT OVERVIEW</span><span>视觉与转化并行</span><span>12.5%</span></div>
        <div className="ot-overview-head">
          <div><small>DESIGN ACROSS TOUCHPOINTS</small><h2>不只做一张<br />好看的活动页。</h2></div>
          <p>围绕用户从“看见—理解—参与—购买”的完整路径，将活动机制、权益信息与品牌情绪组织成一套可持续复用的运营设计语言。</p>
        </div>
        <div className="ot-overview-grid">
          <article><span>01</span><small>CAMPAIGN</small><h3>主题运营活动</h3><p>以节日情绪建立第一视觉锚点，用任务与反馈机制持续推动参与。</p></article>
          <article><span>02</span><small>COMMERCE</small><h3>服务购买转化</h3><p>将套餐差异、权益价值和支付动作组织进一条清晰的决策路径。</p></article>
          <article><span>03</span><small>VISUAL SYSTEM</small><h3>多场景视觉适配</h3><p>在春节、春季与日常服务场景中保持品牌识别，同时建立差异。</p></article>
        </div>
      </div>
    </section>

    <section className="ot-spring" id="pages">
      <div className="pf-shell">
        <div className="ot-section-rail is-light"><span>02 / HERO CAMPAIGN</span><span>春节云录翻牌礼</span><span>35.0%</span></div>
        <div className="ot-spring-head">
          <div><small>SPRING FESTIVAL · RETENTION CAMPAIGN</small><h2>把折扣机制，<br />变成持续期待。</h2></div>
          <div><b>春节云录翻牌礼</b><p>用“逐年翻牌”替代一次性促销，将三年套餐拆成连续反馈。首年直接建立价格吸引力，后续年份通过未知折扣保留期待，并自然衔接购买决策。</p></div>
        </div>
        <div className="ot-spring-stage">
          <div className="ot-spring-notes">
            <article><span>01</span><b>首年确定，降低理解成本</b><p>第一年折扣直接可见，用户可以快速判断活动价值。</p></article>
            <article><span>02</span><b>逐年揭晓，延长参与节奏</b><p>未翻开的卡片制造期待，让优惠信息拥有过程感。</p></article>
            <article><span>03</span><b>权益承接，完成价值解释</b><p>促销后紧接特权与对比，避免页面只剩“便宜”。</p></article>
          </div>
          <div className="ot-spring-device">
            <span className="ot-spring-halo" aria-hidden="true" />
            <OtherPhone src="/case-studies/other/spring-flip-full.png" alt="春节云录像翻牌礼完整活动页" label="FULL CAMPAIGN FLOW / 375 × 2489" />
          </div>
          <div className="ot-spring-side">
            <div className="ot-detail-card is-checkout"><span>CHECKOUT</span><img src="/case-studies/other/spring-checkout.png" alt="春节翻牌礼收银台" /></div>
          </div>
        </div>
        <div className="ot-spring-tags"><span>翻牌解锁</span><span>权益解释</span><span>套餐对比</span><span>收银转化</span></div>
      </div>
    </section>

    <section className="ot-logic">
      <div className="pf-shell">
        <div className="ot-logic-copy"><small>INFORMATION STRATEGY</small><h2 className="ot-display-lines"><span>先制造兴趣，</span><span>再交付理由。</span></h2><p>页面前半段负责吸引与参与，后半段承担权益解释和购买判断。情绪与信息不是二选一，而是按用户决策顺序出现。</p></div>
        <div className="ot-logic-visual">
          <div className="ot-compare-board"><span>BENEFIT COMPARISON / DETAIL</span><img src="/case-studies/other/spring-compare.png" alt="云录像与卡录像权益对比" /></div>
          <ol><li><b>01</b><span>活动吸引</span></li><li><b>02</b><span>机制参与</span></li><li><b>03</b><span>价值理解</span></li><li><b>04</b><span>购买转化</span></li></ol>
        </div>
      </div>
    </section>

    <section className="ot-cloud">
      <div className="pf-shell">
        <div className="ot-section-rail"><span>03 / SERVICE COMMERCE</span><span>T200 云录商城</span><span>62.0%</span></div>
        <div className="ot-cloud-layout">
          <div className="ot-cloud-copy"><small>CLOUD SERVICE · PRICE ARCHITECTURE</small><h2 className="ot-display-lines"><span>复杂套餐，</span><span>也能一眼比较。</span></h2><p>将基础版与高级版按存储周期分组，把价格、自动续费和适用场景放在同一决策层。权益对比表随后承接，帮助用户用使用场景而不是抽象等级完成选择。</p>
            <div className="ot-cloud-points"><article><b>01</b><span>先场景，再价格</span></article><article><b>02</b><span>套餐差异可视化</span></article><article><b>03</b><span>支付动作持续可见</span></article></div>
          </div>
          <div className="ot-cloud-device">
            <span className="ot-cloud-word" aria-hidden="true">CLOUD</span>
            <OtherPhone src="/case-studies/other/t200-cloud-store.jpg" alt="T200 云服务购买与权益对比页面" label="T200 CLOUD STORE / SERVICE COMMERCE" />
          </div>
        </div>
      </div>
    </section>

    <section className="ot-season">
      <div className="pf-shell">
        <div className="ot-section-rail is-light"><span>04 / CAMPAIGN VARIATIONS</span><span>不同主题，同一目标</span><span>82.0%</span></div>
        <div className="ot-season-head"><div><small>SEASONAL OPERATION</small><h2>让每个活动，<br />都有自己的情绪。</h2></div><p>踏青季用清新的自然语义承接长期云录价值；幸运抽奖用更直接的红橙动势强化参与和奖励。两种视觉气质，对应两种用户动机。</p></div>
        <div className="ot-season-grid">
          <article className="is-outing">
            <div className="ot-season-meta"><span>01 / RETENTION</span><h3>踏青季 · 永久云录价到</h3><p>轻盈自然的季节视觉，为长期套餐降低促销感。</p></div>
            <div className="ot-season-canvas"><OtherPhone src="/case-studies/other/outing-season.png" alt="踏青季永久云录像活动页面" label="OUTING SEASON / LONG-TERM VALUE" /></div>
          </article>
          <article className="is-lucky">
            <div className="ot-season-meta"><span>02 / ENGAGEMENT</span><h3>幸运大抽奖</h3><p>奖品、任务和中奖记录在同一屏形成即时反馈。</p></div>
            <div className="ot-season-canvas"><OtherPhone src="/case-studies/other/lucky-draw.png" alt="幸运大抽奖运营活动页面" label="LUCKY DRAW / TASK LOOP" /></div>
          </article>
        </div>
      </div>
    </section>

    <section className="ot-qh-intro" id="qihang-campaigns">
      <div className="pf-shell">
        <div className="ot-section-rail"><span>05 / QIHANG CAMPAIGN SYSTEM</span><span>按活动建立视觉识别</span><span>90.0%</span></div>
        <div className="ot-qh-intro-head">
          <div>
            <small>EDUCATION · CAMPAIGN · CONVERSION</small>
            <h2 className="ot-display-lines"><span>不是物料合集，</span><span>是一套活动传播系统。</span></h2>
          </div>
          <p>围绕不同的招生阶段、课程产品与转化目标，把同一活动拆解为主视觉、横幅、启动页、弹窗和长图详情。每组保持独立的情绪与识别，同时延续启航教育的品牌资产。</p>
        </div>
        <div className="ot-qh-index" aria-label="启航教育活动目录">
          <a href="#campaign-summer"><b>01</b><span>暑期四天强化</span><em>课程转化</em></a>
          <a href="#campaign-school"><b>02</b><span>择校 8 讲</span><em>新课发布</em></a>
          <a href="#campaign-coupon"><b>03</b><span>618 膨胀券</span><em>节点促销</em></a>
          <a href="#campaign-trial"><b>04</b><span>0.1 元资料包</span><em>低门槛获客</em></a>
          <a href="#campaign-spring"><b>05</b><span>小白扫盲计划</span><em>内容种草</em></a>
          <a href="#campaign-matrix"><b>06</b><span>课程产品矩阵</span><em>长期运营</em></a>
        </div>
      </div>
    </section>

    <section className="ot-qh-campaign is-summer" id="campaign-summer">
      <div className="pf-shell">
        <header className="ot-qh-campaign-head">
          <div><small>01 / SUMMER INTENSIVE PROGRAM</small><h2>暑期四天强化上岸营</h2></div>
          <p>用高饱和橙色建立暑期紧迫感，以名师阵容和四日课程节奏强化可信度。横幅负责快速触达，启动页与详情长图承接完整转化。</p>
        </header>
        <CampaignBrief
          goal={["课程转化", "在四天直播窗口内快速建立课程价值，推动预约与进群。"]}
          strategy={["名师 × 节奏", "用人物阵容建立信任，用连续课表制造清晰的行动节奏。"]}
          touchpoints={["3 类核心触点", "流量横幅、活动启动页、课程详情长图。"]}
        />
        <QihangArtwork src="/case-studies/other/qihang/summer-banner.png" alt="暑期四天强化上岸营横幅" label="BANNER / TRAFFIC ENTRY" className="is-banner" />
        <div className="ot-qh-feature-grid">
          <QihangArtwork src="/case-studies/other/qihang/summer-launch.png" alt="暑期四天强化上岸营启动页" label="LAUNCH PAGE / KEY VISUAL" className="is-poster" />
          <div className="ot-qh-long-wrap">
            <QihangArtwork src="/case-studies/other/qihang/summer-detail.png" alt="暑期四天强化上岸营详情长图" label="LONG PAGE / COURSE CONVERSION" className="is-long" />
          </div>
        </div>
      </div>
    </section>

    <section className="ot-qh-campaign is-school" id="campaign-school">
      <div className="pf-shell">
        <header className="ot-qh-campaign-head is-right">
          <div><small>02 / SCHOOL SELECTION COURSE</small><h2>择校 8 讲直通 27 考研</h2></div>
          <p>以电光蓝和清晰的信息层级建立专业、快速的产品感。课程价值、讲师背书和限时折扣在不同触点中保持同一视觉节奏。</p>
        </header>
        <CampaignBrief
          goal={["新课发布", "把复杂的择校方法包装成易理解、可信赖的标准课程产品。"]}
          strategy={["专业 × 效率", "以电光蓝、数据标签和讲师形象建立工具型课程心智。"]}
          touchpoints={["完整产品链路", "横幅负责触达，启动页讲价值，详情页完成解释。"]}
        />
        <div className="ot-qh-school-grid">
          <QihangArtwork src="/case-studies/other/qihang/school-launch.png" alt="择校8讲启动页" label="LAUNCH PAGE / PRODUCT STORY" className="is-poster" />
          <div className="ot-qh-school-stack">
            <QihangArtwork src="/case-studies/other/qihang/school-banner.png" alt="择校8讲横幅" label="BANNER / COURSE RELEASE" className="is-banner" />
            <div className="ot-qh-touchpoints">
              <span><b>01</b>定专业与择院校</span>
              <span><b>02</b>讲师背书与案例</span>
              <span><b>03</b>限时折扣承接转化</span>
            </div>
          </div>
        </div>
        <QihangArtwork src="/case-studies/other/qihang/school-detail.png" alt="择校8讲详情页" label="LONG PAGE / COURSE EXPLANATION" className="is-wide-long" />
      </div>
    </section>

    <section className="ot-qh-campaign is-coupon" id="campaign-coupon">
      <div className="pf-shell">
        <header className="ot-qh-campaign-head">
          <div><small>03 / 618 SALES EVENT</small><h2>1 元定金，千倍膨胀</h2></div>
          <p>把抽象折扣转化为强记忆的“膨胀券”，用票券、礼盒和抢购按钮组成统一资产，在主图、横幅、弹窗与详情页之间持续强化同一个利益点。</p>
        </header>
        <CampaignBrief
          goal={["节点促销", "将价格利益点压缩成一眼可懂、可快速传播的促销概念。"]}
          strategy={["单一记忆符号", "围绕膨胀券持续复用圆环、票券、礼盒和高亮按钮。"]}
          touchpoints={["4 类营销物料", "主图、横幅、弹窗与完整活动详情页。"]}
        />
        <div className="ot-qh-coupon-grid">
          <QihangArtwork src="/case-studies/other/qihang/coupon-wide.png" alt="618膨胀券横幅" label="BANNER / SALES MESSAGE" className="is-banner" />
          <div className="ot-qh-coupon-left">
            <QihangArtwork src="/case-studies/other/qihang/coupon-main.png" alt="618膨胀券活动主图" label="KEY VISUAL / BENEFIT IDEA" className="is-kv" />
            <div className="ot-qh-coupon-minis">
              <QihangArtwork src="/case-studies/other/qihang/coupon-ticket.png" alt="618膨胀券票券视觉" label="COUPON / CORE ASSET" className="is-ticket" />
              <QihangArtwork src="/case-studies/other/qihang/coupon-popup.png" alt="618膨胀券弹窗" label="POPUP / URGENCY" className="is-popup" />
            </div>
          </div>
          <QihangArtwork src="/case-studies/other/qihang/coupon-detail.png" alt="618膨胀券详情长图" label="LONG PAGE / COMPLETE OFFER" className="is-long" />
        </div>
      </div>
    </section>

    <section className="ot-qh-campaign is-trial" id="campaign-trial">
      <div className="pf-shell">
        <header className="ot-qh-campaign-head is-right">
          <div><small>04 / LOW-COST ACQUISITION</small><h2>0.1 元初试真题资料包</h2></div>
          <p>以低门槛资料包完成新用户首购。天空蓝和橙色价格信息建立轻松、可信的氛围，四大权益在所有入口保持一致，减少理解与决策成本。</p>
        </header>
        <CampaignBrief
          goal={["低门槛获客", "用明确的 0.1 元价格降低首次购买阻力，引导新用户转化。"]}
          strategy={["轻量 × 可信", "柔和天空蓝承接学习氛围，橙色集中强调价格与行动。"]}
          touchpoints={["权益一致表达", "横幅、海报和长图统一强调四项资料权益。"]}
        />
        <QihangArtwork src="/case-studies/other/qihang/trial-banner.jpg" alt="0.1元资料包横幅" label="BANNER / ACQUISITION ENTRY" className="is-banner" />
        <div className="ot-qh-trial-grid">
          <QihangArtwork src="/case-studies/other/qihang/trial-poster.jpg" alt="0.1元资料包海报" label="POSTER / BENEFIT OVERVIEW" className="is-poster" />
          <QihangArtwork src="/case-studies/other/qihang/trial-detail.jpg" alt="0.1元资料包详情页" label="LONG PAGE / BENEFIT DETAILS" className="is-long" />
        </div>
      </div>
    </section>

    <section className="ot-qh-campaign is-spring" id="campaign-spring">
      <div className="pf-shell">
        <header className="ot-qh-campaign-head">
          <div><small>05 / SPRING CONTENT CAMPAIGN</small><h2>备考季小白扫盲计划</h2></div>
          <p>用春日户外场景降低考研内容的沉重感，以品牌 IP 串联“了解—领取—参与”的内容种草路径，兼顾活动亲和力与信息识别效率。</p>
        </header>
        <CampaignBrief
          goal={["内容种草", "先解决新用户对考研的基础疑问，再引导资料领取和课程体验。"]}
          strategy={["IP × 场景叙事", "用春日自然场景和品牌角色降低信息压力，提升亲和力。"]}
          touchpoints={["轻量传播组合", "入口横幅、活动启动页与资源领取弹窗。"]}
        />
        <div className="ot-qh-spring-grid">
          <QihangArtwork src="/case-studies/other/qihang/spring-banner.jpg" alt="小白扫盲计划横幅" label="BANNER / CONTENT ENTRY" className="is-banner" />
          <QihangArtwork src="/case-studies/other/qihang/spring-launch.jpg" alt="小白扫盲计划启动页" label="LAUNCH PAGE / CONTENT MAP" className="is-poster" />
          <QihangArtwork src="/case-studies/other/qihang/spring-popup.jpg" alt="小白扫盲计划弹窗" label="POPUP / RESOURCE LEAD" className="is-popup" />
        </div>
      </div>
    </section>

    <section className="ot-qh-matrix" id="campaign-matrix">
      <div className="pf-shell">
        <div className="ot-section-rail is-light"><span>06 / PRODUCT MATRIX</span><span>从活动到长期产品运营</span><span>100%</span></div>
        <header className="ot-qh-matrix-head">
          <div><small>COURSE KVS · E-COMMERCE · OFFLINE CAMP</small><h2>同一品牌，<br />不同产品性格。</h2></div>
          <p>针对数学冲刺、线下集训、专业课一对一和专项课程，以不同色彩与视觉语义区分产品定位，同时保留清晰的标题结构、教师背书和转化信息。</p>
        </header>
        <CampaignBrief
          goal={["长线产品运营", "覆盖不同学科、价格区间与教学形式，形成可扩展的视觉资产库。"]}
          strategy={["统一骨架，差异表达", "保留品牌标题结构，以色彩、人物和场景区分产品性格。"]}
          touchpoints={["6 组代表性主视觉", "课程主图、电商视觉、线下集训与一对一产品。"]}
        />
        <div className="ot-qh-matrix-grid">
          <QihangArtwork src="/case-studies/other/qihang/math-kv.png" alt="数学冲刺点睛班主视觉" label="MATH SPRINT / KEY VISUAL" className="is-square" />
          <QihangArtwork src="/case-studies/other/qihang/math-commerce.png" alt="数学题型技巧班电商主图" label="COMMERCE / PRODUCT KV" className="is-square" />
          <QihangArtwork src="/case-studies/other/qihang/beijing-kv.png" alt="北京集训早鸟营主视觉" label="OFFLINE CAMP / BEIJING" className="is-landscape" />
          <QihangArtwork src="/case-studies/other/qihang/special-kv.png" alt="专业课一对一主视觉" label="ONE-TO-ONE / SPECIAL COURSE" className="is-landscape" />
          <QihangArtwork src="/case-studies/other/qihang/one-to-one-kv.png" alt="公共课一对一主视觉" label="PUBLIC COURSE / MATCHING" className="is-landscape" />
          <QihangArtwork src="/case-studies/other/qihang/mechanics-kv.png" alt="机械原理全程班主视觉" label="MECHANICS / FULL PROGRAM" className="is-landscape" />
        </div>
      </div>
    </section>

    <section className="ot-icon-showcase" id="icon-design">
      <div className="pf-shell">
        <div className="ot-section-rail"><span>07 / ICON DESIGN</span><span>三维图标与礼物系统</span><span>3D SYSTEM</span></div>
        <header className="ot-icon-head">
          <div>
            <small>EDTECH · AIGC · CAMPAIGN ASSET</small>
            <h2 className="ot-display-lines"><span>把功能语言，</span><span>变成视觉礼物。</span></h2>
          </div>
          <p>围绕教育产品、会员权益与活动运营建立一套统一的三维图标语言。以玻璃、金属和柔和珐琅材质控制质感，用橙、蓝、紫三组高光区分功能，同时保持相同视角、体积与光照逻辑。</p>
        </header>

        <div className="ot-icon-grid" aria-label="三维图标设计系统">
          {[
            ["AI 学习助手", "AI Study Bot"],
            ["智能题库", "Smart Question Bank"],
            ["数字课程", "Digital Course"],
            ["会员权益", "Premium Membership"],
            ["活动礼盒", "Campaign Gift"],
            ["成长数据", "Growth Analytics"],
            ["智能客服", "AI Customer Service"],
            ["学习成就", "Learning Achievement"],
            ["效率引擎", "Efficiency Engine"],
          ].map(([title, english], index) => (
            <figure key={title}>
              <div className="ot-icon-art" aria-hidden="true" />
              <figcaption><b>{title}</b><span>{english}</span><small>{String(index + 1).padStart(2, "0")}</small></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>

    <section className="ot-aigc" id="aigc-column">
      <div className="pf-shell">
        <div className="ot-section-rail"><span>08 / AIGC COLUMN</span><span>生成式视觉实验</span><span>AI + DESIGN</span></div>
        <header className="ot-aigc-head">
          <div><small>GENERATIVE VISUAL · ART DIRECTION</small><h2>AIGC<br /><em>专栏</em></h2></div>
          <p>把 AI 作为概念草图、场景搭建和材质实验的协作工具，再通过设计判断完成构图、色彩和品牌语气的统一。重点不是“生成一张图”，而是建立可继续延展的视觉方向。</p>
        </header>

        <article className="ot-aigc-feature">
          <img src="/case-studies/other/aigc-learning-companion.png" alt="AIGC学习伙伴概念视觉" loading="lazy" />
          <div className="ot-aigc-feature-copy">
            <small>EXPERIMENT 01 / LEARNING COMPANION</small>
            <h3>AI 学习伙伴<br />概念视觉</h3>
            <p>以教育陪伴为核心，将角色、知识道具与玻璃界面语言组合成一张可用于品牌提案、活动主视觉和产品氛围图的概念画面。</p>
            <div><span>角色设定</span><span>场景生成</span><span>材质探索</span><span>设计精修</span></div>
          </div>
          <span className="ot-aigc-orbit" aria-hidden="true" />
        </article>

        <div className="ot-aigc-methods">
          <article><small>01 / SCENE</small><b>场景概念</b><p>用光线、景深和空间关系快速验证画面气质。</p></article>
          <article><small>02 / CHARACTER</small><b>角色语言</b><p>控制轮廓、表情与比例，让角色保持品牌亲和力。</p></article>
          <article><small>03 / MATERIAL</small><b>材质实验</b><p>在玻璃、金属与柔性表面之间寻找更成熟的科技感。</p></article>
          <article><small>04 / DIRECTION</small><b>设计回收</b><p>以人工排版和视觉规范收束生成结果，形成可落地资产。</p></article>
        </div>
      </div>
    </section>

    <section className="ot-end">
      <span>END OF SELECTED WORK / 04</span>
      <div><small>THANKS FOR WATCHING</small><h2>返回作品目录</h2><a href="/#catalog"><Arrow /></a></div>
      <footer><span>OTHER DESIGN · VISUAL · OPERATION</span><span>© 2026 BAI JINDE</span></footer>
    </section>
  </main>;
}

const secondaryData: Record<string, { no: string; title: string; subtitle: string; accent: string; intro: string; chapters: string[]; next: string; nextHref: string; visual: string }> = {
  h600: { no: "02", title: "H600 后视镜行车记录仪", subtitle: "SMART HARDWARE / DRIVING SAFETY / MOBILE APP", accent: "#2f7cff", intro: "围绕设备连接、实时画面、行车记录与视频回看，建立车载智能硬件的移动端体验。", chapters: ["设备连接与首次使用", "实时画面与行车状态", "录像检索与证据回看"], next: "启航教育", nextHref: "/project/qihang", visual: "H600" },
  qihang: { no: "03", title: "启航教育 AI 学习体验", subtitle: "EDTECH / AI LEARNING / HARMONYOS", accent: "#ff7139", intro: "面向教育场景重组课程、学习任务与 AI 辅助功能，并完成移动端产品体验与鸿蒙适配。", chapters: ["学习目标与任务拆解", "课程信息架构", "AI 学习辅助体验"], next: "其他设计", nextHref: "/project/other", visual: "AI EDU" },
  other: { no: "04", title: "其他设计与视觉探索", subtitle: "OPERATION / BRAND VISUAL / AIGC", accent: "#a56dff", intro: "集合运营活动、品牌视觉、图标组件与 AIGC 实践，呈现产品项目之外的视觉能力与探索。", chapters: ["智慧生活运营活动", "品牌与营销视觉", "AIGC 创意实验"], next: "返回目录", nextHref: "/#catalog", visual: "MORE" },
};

function SecondaryCase({ slug }: { slug: keyof typeof secondaryData }) {
  const d = secondaryData[slug];
  return <main className={`project-page secondary-case case-${slug}`} style={{ "--case-accent": d.accent } as React.CSSProperties}><CaseTop current={`${d.no} / ${d.title}`} title={d.title} subtitle={d.subtitle} accent={d.accent} />
    <section className="secondary-visual"><div><span>{d.visual}</span><i /></div><p>PROJECT VISUAL / 等待补充真实设计稿</p></section>
    <section className="case-section pf-shell" id="overview"><div className="case-label">01 / 项目概览</div><div className="case-content"><h2>{d.intro}</h2><p className="case-lead">当前已建立独立项目页面、章节结构与内容层级。后续接入真实设计稿后，将继续补充调研、策略与首要页面的逐页分析。</p></div></section>
    <section className="case-light" id="pages"><div className="pf-shell"><div className="case-label">02 / 内容结构</div><div className="case-content"><div className="secondary-chapters">{d.chapters.map((chapter, i) => <article key={chapter}><span>0{i + 1}</span><h3>{chapter}</h3><p>研究背景、设计目标、关键决策与最终方案将在此章节完整呈现。</p></article>)}</div></div></div></section>
    <section className="case-section pf-shell"><div className="case-label">03 / 素材状态</div><div className="case-content"><div className="asset-note"><span>CONTENT REQUIRED</span><h2>等待真实项目页面与过程资料。</h2><p>不会使用无关图片替代你的作品。你后续提供对应 Figma 节点、截图或项目说明后，可直接填入当前结构。</p></div></div></section><CaseEnd next={d.next} href={d.nextHref} />
  </main>;
}

function CaseEnd({ next, href }: { next: string; href: string }) {
  const isH600 = href === "/project/h600";
  const isQihang = href === "/project/qihang";
  return <section className={`case-end${isH600 ? " case-end-h600" : ""}${isQihang ? " case-end-qihang" : ""}`}>
    <span>{isH600 ? "NEXT PROJECT / 02 · SMART HARDWARE" : isQihang ? "NEXT PROJECT / 03 · AI EDUCATION" : "NEXT PROJECT"}</span>
    {isH600 && <div className="case-end-h600-device" aria-hidden="true"><img src="/case-studies/h600/h600-drive-single.png" alt="" /><i /><i /><b>REC</b><small>4K UHD · ADAS · GPS</small></div>}
    <a href={href}>{next}<Arrow /></a>
    <small>{isH600 ? "DRIVING SAFETY / MOBILE EXPERIENCE" : isQihang ? "EDTECH / AI LEARNING / HARMONYOS" : "© 2026 BAI JINDE"}</small>
  </section>;
}

export default function Portfolio() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;
  const path = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
  useSiteMotion(path);
  if (path === "/project/smart-life-botslab") return <SmartCase />;
  if (path === "/project/h600") return <H600Case />;
  if (path === "/project/qihang") return <QihangCase />;
  if (path === "/project/other") return <OtherCase />;
  const slug = path.replace("/project/", "") as keyof typeof secondaryData;
  if (path.startsWith("/project/") && secondaryData[slug]) return <SecondaryCase slug={slug} />;
  return <HomePage />;
}
