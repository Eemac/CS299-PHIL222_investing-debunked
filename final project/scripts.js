// ===== Accordion =====
    document.querySelectorAll(".acc-head").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-acc");
        const panel = document.getElementById(id);
        const isOpen = panel.classList.contains("open");
        panel.classList.toggle("open", !isOpen);
      });
    });

// ===== Tabs (scoped per article) =====
document.querySelectorAll("article.tile").forEach(article => {
  const tabButtons = article.querySelectorAll(".tabbar button");
  const tabPanels  = article.querySelectorAll(".tabpanel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // deactivate only this article's tabs
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      // activate selected tab
      btn.classList.add("active");
      const id = btn.getAttribute("data-tab");
      const panel = article.querySelector("#" + id);
      if (panel) panel.classList.add("active");
    });
  });
});

// ===== Floating TOC active section highlight (stable, consolidated) =====
const tocLinks = Array.from(document.querySelectorAll(".toc a[href^='#']"))
  .filter(a => !["#top", "#page-top"].includes(a.getAttribute("href")));

const sections = tocLinks
  .map(a => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function getTopOffset() {
  const ticker = document.querySelector(".wsj-ticker");
  const tickerH = ticker ? ticker.getBoundingClientRect().height : 0;
  return Math.round(tickerH + 24); // ticker height + breathing room
}

function setActiveTOC(href) {
  tocLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === href));
}

function updateActiveTOC() {
  if (!sections.length) return;

  // Near top of page, treat Overview as active (masthead sits above it)
  if (window.scrollY <= 10) {
    setActiveTOC("#overview");
    return;
  }

  const y = window.scrollY + getTopOffset() + 1;

  // Active section = last section whose top is above the offset line
  let current = sections[0];
  for (const s of sections) {
    if (s.offsetTop <= y) current = s;
  }

  setActiveTOC("#" + current.id);
}

// Throttle scroll updates with rAF
let tocTicking = false;
window.addEventListener("scroll", () => {
  if (!tocTicking) {
    requestAnimationFrame(() => {
      updateActiveTOC();
      tocTicking = false;
    });
    tocTicking = true;
  }
});

window.addEventListener("load", updateActiveTOC);
window.addEventListener("resize", updateActiveTOC);

// Optional: on click, update immediately to avoid a brief “wrong” flash
tocLinks.forEach(a => {
  a.addEventListener("click", () => setActiveTOC(a.getAttribute("href")));
});

  // Run on scroll (throttled by rAF)
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // setActiveByScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // window.addEventListener("load", setActiveByScroll);
  // window.addEventListener("resize", setActiveByScroll);

  // Optional: ensure click sets active immediately (prevents flash)
  tocLinks.forEach(a => {
    a.addEventListener("click", () => {
      tocLinks.forEach(x => x.classList.remove("active"));
      a.classList.add("active");
    });
  });

  function syncTickerOffset(){
    const t = document.querySelector('.wsj-ticker');
    if(!t) return;
    const h = Math.ceil(t.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--ticker-h', h + 'px');
  }
  window.addEventListener('load', syncTickerOffset);
  window.addEventListener('resize', syncTickerOffset);


  window.addEventListener("load", () => {
    const basePath = "./datavisualizations/";
    vegaEmbed("#viz-embed-1", likertA, {actions:false, renderer:"svg"});
    vegaEmbed("#viz-embed-2", dumbbellA,   {actions:false, renderer:"svg"});

    // Then add a line like this here:
    // vegaEmbed("#viz-embed-2", uniqueVariableName,   {actions:false, renderer:"svg"});
  });