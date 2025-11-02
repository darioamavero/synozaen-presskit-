// Synozän Presskit — Lazy Loader for components
// Save as: synozaen-presskit/scripts/script.js

const SECTION_IDS = ["liebe","wissen","gemeinschaft","geschichte","transformation"];

// Load a single section by id from /Komponenten/<id>.html
function loadSection(id){
  const el = document.getElementById(id);
  if(!el || el.dataset.loaded) return;
  fetch(`Komponenten/${id}.html?v=live`)
    .then(r => r.text())
    .then(html => {
      el.innerHTML = html;
      el.dataset.loaded = "1";
    })
    .catch(err => console.error("Failed to load section:", id, err));
}

// On Enter button click: load all sections and scroll to #liebe
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("enter");
  if(btn){
    btn.addEventListener("click", () => {
      SECTION_IDS.forEach(loadSection);
      const first = document.getElementById("liebe");
      if(first) first.scrollIntoView({behavior:"smooth"});
    });
  }
});

// Also lazy-load a section when it first becomes visible
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if(e.isIntersecting) loadSection(e.target.id);
  });
}, { rootMargin: "200px 0px" });

document.addEventListener("DOMContentLoaded", ()=>{
  SECTION_IDS.forEach(id=>{
    const el = document.getElementById(id);
    if(el) observer.observe(el);
  });
});
