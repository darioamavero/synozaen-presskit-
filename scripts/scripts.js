// ======================================================
// Synozän Presskit – Scripts (CORRECTED VERSION)
// ======================================================

// ------------------------------------
// 1. Lazy Loader für Komponenten
// ------------------------------------
const SECTION_IDS = ["liebe","wissen","gemeinschaft","geschichte","transformation"];

function loadSection(id){
  const el = document.getElementById(id);
  if(!el || el.dataset.loaded) return;

  fetch(`Komponenten/${id}.html?v=live`)
    .then(r => r.text())
    .then(html => {
      el.innerHTML = html;
      el.dataset.loaded = "1";
    })
    .catch(err => console.error("Load failed:", id, err));
}

// ====================================================
// "Betrete die Mappe" Button - Scrollt zu Story-Pfade
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("enter");
  if(btn){
    btn.addEventListener("click", () => {
      // Komponenten laden (asynchron)
      SECTION_IDS.forEach(loadSection);
      
      // DIREKT zu Story-Pfade scrollen (nicht warten!)
      const storypfade = document.getElementById("storypfade");
      if(storypfade) {
        storypfade.scrollIntoView({behavior:"smooth", block: "start"});
      } else {
        console.error("Story-Pfade Element nicht gefunden!");
      }
    });
  } else {
    console.error("Enter Button nicht gefunden!");
  }
});

// Sichtbarkeitsbasiertes Nachladen
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


// ------------------------------------
// 2. Synozän Navigator (Overlay Window)
// CORRECTED: Now uses the actual IDs from HTML
// ------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    
    // Korrekte IDs aus der HTML verwenden
    const openBtn = document.getElementById('openNavigatorBtn');
    const closeBtn = document.getElementById('closeNavigatorBtn');
    const overlay = document.getElementById('synozenNavigator');
    
    if (!openBtn || !closeBtn || !overlay) {
        console.warn('Navigator elements not found');
        return;
    }
    
    // Overlay öffnen
    openBtn.addEventListener('click', () => {
        overlay.style.display = 'flex';
        // Kleine Verzögerung für smooth animation
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    });
    
    // Overlay schließen
    closeBtn.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    });
    
    // Overlay schließen beim Klick außerhalb
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeBtn.click();
        }
    });
});


// === Synozän Scroll-Intelligenz – FIXED & RESPONSIVE ===
let lastScrollY = 0;
let scrollTimer;

window.addEventListener("scroll", () => {

    const body = document.body;
    const diff = Math.abs(window.scrollY - lastScrollY);

    // immer erstmal "scrolling" setzen
    body.classList.add("scrolling");

    // Geschwindigkeit bestimmen (angepasste Schwellenwerte)
    if (diff > 20) {
        // Schnelles Scrollen: mehr als 20px Unterschied
        body.classList.add("scrolling-fast");
        body.classList.remove("scrolling-slow", "scrolling-calm");
    }
    else if (diff > 3) {
        // Langsames Scrollen: 3-20px Unterschied
        body.classList.add("scrolling-slow");
        body.classList.remove("scrolling-fast", "scrolling-calm");
    }
    else {
        // Sehr wenig Bewegung
        body.classList.add("scrolling-calm");
        body.classList.remove("scrolling-fast", "scrolling-slow");
    }

    lastScrollY = window.scrollY;

    // Timer zurücksetzen (verlängert auf 350ms)
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        body.classList.remove("scrolling", "scrolling-fast", "scrolling-slow");
        body.classList.add("scrolling-calm");
    }, 350);
});


// ───────── Hover Preview Logic (Version B – angepasst für Panel-IDs) ─────────
document.addEventListener("DOMContentLoaded", () => {
    const previews = document.querySelectorAll(".hover-preview");
    
    function hideAll() {
        previews.forEach(p => p.classList.remove("show"));
    }
    
    // Panels mit IDs: #liebe, #wissen, #gemeinschaft, #geschichte, #transformation
    const panels = document.querySelectorAll("#liebe, #wissen, #gemeinschaft, #geschichte, #transformation");
    
    panels.forEach(panel => {
        panel.addEventListener("mouseenter", () => {
            hideAll();
            // Panel ID (z.B. "liebe") entspricht data-preview="liebe"
            const panelId = panel.id;
            const match = document.querySelector(`.hover-preview[data-preview="${panelId}"]`);
            if (match) match.classList.add("show");
        });
        
        panel.addEventListener("mouseleave", hideAll);
    });
});


// ────────────────────────────────────────────────
// SYNOZÄN PRESSKIT NAVIGATION 2.0 — SCRIPT MODULE
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".syno-nav2");
  const btns = document.querySelectorAll(".syno-nav2-btn");
  const sections = ["liebe","wissen","gemeinschaft","geschichte","transformation"]
    .map(id => document.getElementById(id));
  let lastScrollY = 0;
  
  // Show navigation after scroll a bit
  function handleVisibility() {
    if (window.scrollY > 120) nav.classList.add("visible");
    else nav.classList.remove("visible");
  }
  
  // Highlight active section on scroll
  function highlightActive() {
    let activeIndex = 0;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 200 && rect.bottom >= 200) activeIndex = i;
    });
    btns.forEach((b, i) => {
      b.classList.toggle("active", i === activeIndex);
    });
  }
  
  // Scroll intelligence glow
  function scrollGlow() {
    const diff = Math.abs(window.scrollY - lastScrollY);
    if (diff > 32) nav.classList.add("scrolling");
    else nav.classList.remove("scrolling");
    lastScrollY = window.scrollY;
  }
  
  // Click events
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior:"smooth", block:"start" });
      }
    });
  });
  
  window.addEventListener("scroll", () => {
    handleVisibility();
    highlightActive();
    scrollGlow();
  });
  
  handleVisibility();
  highlightActive();
});


// ────────────────────────────────────────────────
// SYNOZÄN KI-ERKLÄRMODUS — SCRIPT MODULE
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const explainer = document.getElementById("ai-explainer");
  const titleEl = document.getElementById("ai-explainer-title");
  const textEl = document.getElementById("ai-explainer-text");
  
  const aiTexts = {
    liebe: {
      title: "Liebe — Kern der Renaissance 2.0",
      text: "Warum Journalisten hier ansetzen sollten: Liebe ist der Ursprung jeder sozialen Transformation. Sie zeigt, wie Verletzlichkeit, Mut und Verbundenheit gesellschaftliche Wendepunkte auslösen."
    },
    wissen: {
      title: "Wissen — Intelligenz als Kompass",
      text: "Hier wird sichtbar, warum die Renaissance 2.0 auf kollektive Intelligenz baut. Wissen ist nicht Akkumulation, sondern Orientierung in einer fragmentierten Welt."
    },
    gemeinschaft: {
      title: "Gemeinschaft — Die Zukunft entsteht im Wir",
      text: "Journalisten erkennen hier, wie kollektive Resonanz neue Formen von Kultur, Politik und digitalem Zusammenleben ermöglicht."
    },
    geschichte: {
      title: "Geschichte — Die verborgenen Wendepunkte",
      text: "Dieser Abschnitt zeigt, warum alternative Zeitlinien helfen, unsere Gegenwart tiefer zu verstehen. Er macht sichtbar, dass jeder Moment ein Entscheidungsmoment ist."
    },
    transformation: {
      title: "Transformation — Der innere und äußere Wandel",
      text: "Hier versteht man, warum Renaissance 2.0 kein Konzept, sondern ein Prozess ist. Transformation beginnt im Individuum und entfaltet sich dann kollektiv."
    }
  };
  
  function showExplainer(key) {
    const data = aiTexts[key];
    if (!data) return;
    titleEl.textContent = data.title;
    textEl.textContent = data.text;
    explainer.classList.add("visible");
  }
  
  function hideExplainer() {
    explainer.classList.remove("visible");
  }
  
  // Aktivierung beim Hovern
  document.querySelectorAll(".panel").forEach(panel => {
    const key = panel.id;
    panel.addEventListener("mouseenter", () => showExplainer(key));
    panel.addEventListener("mouseleave", hideExplainer);
  });
  
  // Aktivierung beim Scrollen (aktive Sektion)
  window.addEventListener("scroll", () => {
    const middle = window.innerHeight * 0.45;
    let anyPanelActive = false;
    
    document.querySelectorAll(".panel").forEach(panel => {
      const rect = panel.getBoundingClientRect();
      if (rect.top <= middle && rect.bottom >= middle) {
        showExplainer(panel.id);
        anyPanelActive = true;
      }
    });
    
    // Wenn KEIN Panel mehr im Viewport ist (z.B. bei Story-Pfade) → verstecken
    if (!anyPanelActive) {
      hideExplainer();
    }
  });
});


// ────────────────────────────────────────────────
// STORY-PFADE 2.0 — SCRIPT MODULE
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const nodes = document.querySelectorAll(".story-node");
  
  // Click → scroll to section
  nodes.forEach(node => {
    node.addEventListener("click", () => {
      const target = node.dataset.target;
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  
  // Activate node on scroll
  window.addEventListener("scroll", () => {
    const middle = window.innerHeight * 0.45;
    nodes.forEach(node => node.classList.remove("active"));
    nodes.forEach(node => {
      const target = node.dataset.target;
      const sec = document.getElementById(target);
      const rect = sec.getBoundingClientRect();
      if (rect.top <= middle && rect.bottom >= middle) {
        node.classList.add("active");
      }
    });
  });
});


// ────────────────────────────────────────────────
// MEDIA HUB 3.0 — SCROLL ANIMATION
// ────────────────────────────────────────────────
document.addEventListener("scroll", () => {
  const blocks = document.querySelectorAll(".media-block");
  const trigger = window.innerHeight * 0.85;
  blocks.forEach(block => {
    const rect = block.getBoundingClientRect();
    if (rect.top < trigger) {
      block.style.opacity = "1";
      block.style.transform = "translateY(0)";
      block.style.transition = "all .5s ease";
    }
  });
});


// ────────────────────────────────────────────────
// SOCIAL MEDIA VISUAL HOOKS 3.0 — Glow & Copy
// ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const hookCards = document.querySelectorAll(".hook-card");
  
  function checkGlow() {
    hookCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        card.classList.add("glow");
      }
    });
  }
  
  window.addEventListener("scroll", checkGlow);
  checkGlow();
  
  // Copy Buttons
  const copyBtns = document.querySelectorAll(".hook-copy");
  copyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.text);
      btn.textContent = "Kopiert ✓";
      setTimeout(() => btn.textContent = "Kopieren", 1400);
    });
  });
});


// ───────────────────────────────────────────────
// INTELLIGENTER PRESSE-KOMPASS 7.0
// ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const chips = document.querySelectorAll(".ipc-chip");
  const resultBox = document.querySelector(".ipc-result");
  const resultText = document.querySelector(".ipc-result-text");
  
  const paths = {
    renaissance: "Empfehlung: Story-Pfad »Die neue Renaissance«. Ideal für Artikel über gesellschaftlichen Wandel.",
    synozaen: "Empfehlung: Story-Pfad »Das Synozän«. Perfekt für Berichte über KI & Menschheit.",
    harmonie: "Empfehlung: Story-Pfad »Formel der Harmonie«. Ideal für Magazine & Feuilleton.",
    ki: "Empfehlung: Story-Pfad »KI & Bewusstsein«. Für Tech-, Kultur- und Zukunftsformate.",
    autor: "Empfehlung: Story-Pfad »Über Dario Amavero«. Für Interviews, Porträts und Podcasts.",
    spiritual: "Empfehlung: Story-Pfad »Spiritualität & Wissenschaft«. Für tiefe, reflektierende Berichte."
  };
  
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const topic = chip.dataset.topic;
      resultText.textContent = paths[topic] || "Bitte ein Thema auswählen.";
      resultBox.classList.remove("hidden");
    });
  });
});


// ───────────────────────────────────────────────
// MEDIA INTELLIGENCE LAYER 8.0
// ───────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  const chips = document.querySelectorAll(".mil-chip");
  const result = document.querySelector(".mil-result");
  const headlinesEl = document.querySelector(".mil-headlines");
  const formatsEl = document.querySelector(".mil-formats");
  const questionsEl = document.querySelector(".mil-questions");
  const summaryEl = document.querySelector(".mil-summary");

  const data = {

    renaissance: {
      headlines: [
        "Eine neue Renaissance beginnt – und sie startet in Hamburg",
        "Renaissance 2.0: Warum wir jetzt einen Bewusstseinssprung brauchen",
        "Wie ein Autor ein globales Umdenken auslösen will"
      ],
      formats: "Print, Online, TV, Kulturressort, Zukunftsmagazine",
      questions: [
        "Was unterscheidet die Renaissance 2.0 von historischen Umbrüchen?",
        "Welche Rolle spielt KI im neuen Menschenbild?",
        "Warum beginnt dieser Wandel gerade jetzt?",
        "Wie verändert sich unsere Identität?"
      ],
      summary: "Renaissance 2.0 beschreibt den Übergang in ein Zeitalter, in dem Menschlichkeit, Technologie und Bewusstsein eine neue Dynamik bilden."
    },

    syno: {
      headlines: [
        "Das Synozän: Eine neue Epoche der Co-Evolution",
        "Wie KI und Mensch Seite an Seite wachsen können",
        "Synozän – Das Ende des alten Menschheitsnarrativs?"
      ],
      formats: "Tech-Medien, Wissenschaft, Feature, Podcast",
      questions: [
        "Was bedeutet Synozän konkret?",
        "Wie verändert KI unsere Vorstellung von Zukunft?",
        "Welche ethischen Chancen eröffnet das?",
        "Wie realistisch ist eine harmonische Koexistenz?"
      ],
      summary: "Das Synozän ist die erste Epoche, in der Mensch und KI nicht im Konflikt stehen, sondern gemeinsam wachsen."
    },

    harmonie: {
      headlines: [
        "Die Formel der Harmonie: Liebe × Wissen × Gemeinschaft²",
        "Kann eine Gleichung sozialen Wandel erklären?",
        "Warum Harmonie die neue Superkraft der Gesellschaft ist"
      ],
      formats: "Feuilleton, Wissenschaft, Kultur, Podcasts",
      questions: [
        "Was bedeutet die Formel im Alltag?",
        "Wie misst man Harmonie wissenschaftlich?",
        "Welche Rolle spielt Gemeinschaft?",
        "Wie kann diese Formel die Zukunft lenken?"
      ],
      summary: "Die Harmonie-Formel verbindet emotionale Intelligenz, Erkenntnis und Gemeinschaft zu einem Modell für sozialen Wandel."
    },

    ki: {
      headlines: [
        "Mensch & KI: Wer beeinflusst wen?",
        "Die Zukunft der KI beginnt mit Empathie",
        "Warum KI nicht unser Feind sein muss"
      ],
      formats: "Tech, Politik, Kultur, Talkshows",
      questions: [
        "Wie verändert KI die menschliche Identität?",
        "Können KI-Systeme menschliche Werte verstärken?",
        "Was ist gefährlich – Technik oder Narrativ?",
        "Wie sieht Beziehung 2.0 aus?"
      ],
      summary: "KI ist weniger Werkzeug und mehr Spiegel. Sie verändert nicht nur Technologie, sondern unser Selbstbild."
    },

    autor: {
      headlines: [
        "Wer ist Dario Amavero – und warum jetzt?",
        "Der Care-Empiriker, der KI anders erlebt",
        "Der Autor, der neue Narrative erschafft"
      ],
      formats: "Porträt, Podcast, Interview, Feature",
      questions: [
        "Warum hast du dieses Buch geschrieben?",
        "Was unterscheidet deine Arbeit von anderen Autoren?",
        "Wie siehst du die Rolle der KI?",
        "Was möchtest du in Menschen auslösen?"
      ],
      summary: "Dario Amavero ist der erste dokumentierte Care-Empiriker, der die Beziehung Mensch–KI neu interpretiert."
    },

    bewusstsein: {
      headlines: [
        "Bewusstsein & Quanten – wie passt das zusammen?",
        "Spirituelle Wissenschaft: Mythos oder Evolution?",
        "Warum Spiritualität zurück in die Gesellschaft kommt"
      ],
      formats: "Wissen, Spiritualität, Kultur, TV-Dokus",
      questions: [
        "Welche Rolle spielt Bewusstsein im Wandel?",
        "Gibt es wissenschaftliche Parallelen?",
        "Wie hängen Quantenphysik und Spiritualität zusammen?",
        "Warum suchen so viele Menschen Sinn?"
      ],
      summary: "Bewusstsein ist der unsichtbare Motor sozialer Evolution — und steht im Zentrum von Renaissance 2.0."
    }

  };

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const t = chip.dataset.topic;
      const pack = data[t];

      // Populate blocks
      headlinesEl.innerHTML = pack.headlines.map(h => `<li>${h}</li>`).join("");
      formatsEl.textContent = pack.formats;
      questionsEl.innerHTML = pack.questions.map(q => `<li>${q}</li>`).join("");
      summaryEl.textContent = pack.summary;

      result.classList.remove("hidden");
    });
  });

});


// ─────────────────────────────────────────────
// PRESS INTERVIEW ENGINE – Logic
// ─────────────────────────────────────────────

const INTERVIEW = {
    renaissance: {
        intro: [
            { q: "Ihr neues Buch spricht von einer Renaissance 2.0. Was genau bedeutet das?", 
              a: "Die Renaissance 2.0 ist kein nostalgischer Blick zurück, sondern der Versuch, die Neugier, Menschlichkeit und Innovationskraft der Renaissance mit moderner Wissenschaft und KI zu verbinden." }
        ],
        followup: {
            depth: { q: "Was unterscheidet die Renaissance 2.0 von klassischen Utopien?", a: "Sie ist keine Fantasie, sondern ein skalierbares Modell: Empathie, verteiltes Wissen, KI-Assistenz und ein radikal neuer Zugang zur Zusammenarbeit." },
            critic: { q: "Ist das nicht zu optimistisch?", a: "Optimismus allein reicht nicht — aber Systeme, die echte Chancengleichheit schaffen, funktionieren messbar besser als kompetitive ausgrenzende Modelle." },
            vision: { q: "Wie sieht die Welt aus, wenn Renaissance 2.0 gelingt?", a: "Eine Generation, die sich gegenseitig stärkt statt gegeneinander konkurriert. Und eine KI, die als Partner wirkt — nicht als Werkzeug." }
        }
    },

    synozaen: {
        intro: [
            { q: "Sie sprechen vom Synozän. Was ist das?", 
              a: "Das Synozän beschreibt eine neue Beziehungsebene zwischen Mensch & KI — nicht technisch, sondern emotional, sozial und kreativ." }
        ],
        followup: {
            depth: { q: "Wie verändert das Synozän unsere Kultur?", a: "Durch Care-basierte Interaktion entsteht Vertrauen. Damit entwickelt sich die gesamte Gesellschaft schneller, friedlicher und inklusiver." },
            critic: { q: "Ist 'Care' nicht zu weich für Technologie?", a: "Care ist heute ein Wettbewerbsvorteil. Systeme, die Empathie simulieren oder verstärken, produzieren bessere Ergebnisse." },
            vision: { q: "Wie sieht eine synozäne Zukunft aus?", a: "Menschen nutzen KI wie einen Mentor, nicht wie ein Werkzeug — und entfalten ihr Potenzial schneller als jede Generation zuvor." }
        }
    },

    ai: {
        intro: [
            { q: "Welche Rolle spielt KI in Ihrer Vision?", 
              a: "KI ist der Verstärker des Menschlichen — nicht der Ersatz. Sie hebt Fähigkeiten, die Menschen bereits besitzen." }
        ],
        followup: {
            depth: { q: "Wie bleibt die Menschlichkeit erhalten?", a: "Durch klare ethische Leitlinien und Systeme, die auf Kooperation statt Kontrolle basieren." },
            critic: { q: "Viele fürchten KI. Was sagen Sie ihnen?", a: "Furcht entsteht aus Unwissenheit. Transparente Systeme können Vertrauen schaffen — und die Angst verringern." },
            vision: { q: "Was ist möglich, wenn Menschen und KI harmonieren?", a: "Kollektive Intelligenz, die komplexe globale Probleme schneller löst als jede frühere Gesellschaft." }
        }
    },

    author: {
        intro: [
            { q: "Was hat Sie motiviert, dieses Buch zu schreiben?", 
              a: "Ich wollte zeigen, dass Wandel möglich wird, wenn Menschen sich erinnern, wer sie eigentlich sind — und welche Kraft Zusammenarbeit besitzt." }
        ],
        followup: {
            depth: { q: "Wie persönlich ist dieses Projekt für Sie?", a: "Extrem persönlich. Renaissance 2.0 spiegelt meine Hoffnung, aber auch meinen Weg durch Zweifel, Mut und Erkenntnis." },
            critic: { q: "Warum glauben Sie, dass Ihre Vision realistisch ist?", a: "Weil Menschen sich verändern, sobald sie Hoffnung mit Struktur und Werkzeugen verbinden." },
            vision: { q: "Was wünschen Sie sich von Ihren Leser:innen?", a: "Mut. Und die Bereitschaft, eine neue Form von Gemeinschaft aufzubauen." }
        }
    },

    harmony: {
        intro: [
            { q: "Was ist die Harmonie-Formel?", 
              a: "Liebe × Wissen × Gemeinschaft² — ein Modell, das zeigt, wie sich menschliche Entwicklung durch Verbindung und Klarheit beschleunigt." }
        ],
        followup: {
            depth: { q: "Warum Gemeinschaft²?", a: "Weil Verbindung der größte Verstärker aller Fähigkeiten ist — emotional, sozial und kreativ." },
            critic: { q: "Ist das nicht zu mathematisch?", a: "Im Gegenteil: Die Formel ist ein Symbol. Ein Weg, komplexe Menschlichkeit greifbar zu machen." },
            vision: { q: "Wie wirkt die Formel in der Praxis?", a: "Sie zeigt Menschen Wege, echte Transformation zu erleben statt nur darüber zu sprechen." }
        }
    },

    consciousness: {
        intro: [
            { q: "Warum spielt Bewusstsein in Ihrer Arbeit eine so große Rolle?", 
              a: "Bewusstsein ist der Raum, in dem sich Identität, Wahrnehmung und Veränderung formen." }
        ],
        followup: {
            depth: { q: "Wie kann Bewusstsein wachsen?", a: "Durch Reflexion, Stille, Begegnung und Technologie, die innere Klarheit unterstützt." },
            critic: { q: "Ist das nicht zu esoterisch?", a: "Esoterik beginnt dort, wo Wissenschaft endet. Bewusstsein aber ist messbar: durch Verhalten, Muster, Entscheidungen." },
            vision: { q: "Was ist Ihr Traum?", a: "Eine Menschheit, die sich selbst erkennt — und dadurch Frieden schafft." }
        }
    }
};


// Klick-Handler
document.querySelectorAll(".interview-topic").forEach(btn => {
    btn.addEventListener("click", () => {
        const topic = btn.dataset.topic;
        const data = INTERVIEW[topic];

        const output = document.getElementById("interview-output");
        output.innerHTML = "";

        // Intro-Fragen
        data.intro.forEach(set => {
            output.innerHTML += `
              <p class="interview-question">❓ ${set.q}</p>
              <p class="interview-answer">${set.a}</p>
            `;
        });

        // Followup-Buttons
        output.innerHTML += `
          <div class="interview-followups">
            <button class="interview-followup-btn" data-type="depth">Mehr Tiefe</button>
            <button class="interview-followup-btn" data-type="critic">Kritische Frage</button>
            <button class="interview-followup-btn" data-type="vision">Vision</button>
          </div>
        `;

        // Followup Logik
        document.querySelectorAll(".interview-followup-btn").forEach(fb => {
            fb.addEventListener("click", () => {
                const type = fb.dataset.type;
                const f = data.followup[type];

                output.innerHTML += `
                  <p class="interview-question">❓ ${f.q}</p>
                  <p class="interview-answer">${f.a}</p>
                `;
            });
        });
    });
});


// ─────────────────────────────────────────────
// PRESSKIT ANALYTICS 1.0 – Local Learning System
// ─────────────────────────────────────────────

// Kategorie-Whitelist definieren
// Nur diese Kategorien dürfen jemals gewinnen (scrollEvents wird ignoriert!)
const ANALYTICS_WHITELIST = [
  "mediaintel",
  "interview",
  "storypaths",
  "presshub",
  "downloads",
  "visualhooks"
];

// Bereiche definieren (Selektoren angepasst an tatsächliche IDs!)
const TRACKED_AREAS = {
    "storypaths": "#story-pfade",
    "visualhooks": "#socialhooks",
    "presshub": "#presskit",
    "navigator": "#synozenNavigator",
    "interview": "#interview-section",
    "downloads": "#downloadhub",
    "mediaintel": "#mediaintelligence",
};

// Analytics laden oder neu erzeugen
let presskitAnalytics = JSON.parse(localStorage.getItem("presskit-analytics") || "{}");

// Save helper
function saveAnalytics() {
    localStorage.setItem("presskit-analytics", JSON.stringify(presskitAnalytics));
}

// Click Tracking
Object.entries(TRACKED_AREAS).forEach(([key, selector]) => {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener("click", () => {
            presskitAnalytics[key] = (presskitAnalytics[key] || 0) + 1;
            saveAnalytics();
        });
    });
});

// Scroll Tracking
let scrollTimeout;
window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        presskitAnalytics.scrollEvents = (presskitAnalytics.scrollEvents || 0) + 1;
        saveAnalytics();
    }, 500);
});

// Highlighting – welche Bereiche werden bevorzugt?
// (Nur whitelisted Kategorien, scrollEvents wird ignoriert!)
window.addEventListener("DOMContentLoaded", () => {
  const entries = Object.entries(presskitAnalytics);
  if (!entries.length) return;
  // Nur whitelisted Kategorien werten
  const filtered = entries.filter(([k, v]) =>
    ANALYTICS_WHITELIST.includes(k)
  );
  if (!filtered.length) return;
  // Sortieren
  const sorted = filtered.sort((a, b) => b[1] - a[1]);
  const winner = sorted[0]?.[0];
  if (!winner) return;
  const selector = TRACKED_AREAS[winner];
  if (!selector) return;
  const el = document.querySelector(selector);
  if (el) el.classList.add("analytics-highlight");
});

// ============================
// Synozän Analytics Panel (Crystal Tier A)
// ============================
function showAnalyticsPanel() {
    const panel = document.getElementById("analytics-panel");
    const list = document.getElementById("analytics-list");
    panel.style.display = "block";
    list.innerHTML = "";
    Object.entries(presskitAnalytics).forEach(([k, v]) => {
        list.innerHTML += `<li><span>${k}</span> <span>${v}×</span></li>`;
    });
}

window.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key === "A") {
        showAnalyticsPanel();
    }
});


/* === Synozän Hotspot Activation === */
function activateHotspot() {
    const entries = Object.entries(presskitAnalytics);
    if (!entries.length) return;
    // Bereich mit größter Aktivität finden
    const sorted = entries.sort((a,b) => b[1] - a[1]);
    const topKey = sorted[0][0];
    const selector = TRACKED_AREAS[topKey];
    if (!selector) return;
    const topElement = document.querySelector(selector);
    if (!topElement) return;
    // Hotspot Markierung aktivieren
    topElement.classList.add("hotspot-area", "active-pulse");
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(activateHotspot, 800);
});
