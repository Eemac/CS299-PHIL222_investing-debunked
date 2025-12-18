// ===== Accordion =====
    document.querySelectorAll(".acc-head").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-acc");
        const panel = document.getElementById(id);
        const isOpen = panel.classList.contains("open");
        panel.classList.toggle("open", !isOpen);
      });
    });

    // ===== Tabs =====
    const tabButtons = document.querySelectorAll(".tabbar button");
    const tabPanels  = document.querySelectorAll(".tabpanel");
    tabButtons.forEach(b => b.addEventListener("click", () => {
      tabButtons.forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      const id = b.getAttribute("data-tab");
      tabPanels.forEach(p => p.classList.toggle("active", p.id === id));
    }));

    // ===== Segmented control (visual only) =====
    document.querySelectorAll(".segmented").forEach(seg => {
      seg.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          seg.querySelectorAll("button").forEach(x => x.classList.remove("active"));
          btn.classList.add("active");
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