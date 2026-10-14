/* Brightway Mail: work-session simulation for a 2 x 2 online experiment.
 * Factor 1 (Type of AI use): routine = Standard mode, infusion = Full mode
 * Factor 2 (Work interruptions): on = Notifications, off = Focus mode
 * Condition is read from the URL: index.html?s=<key>. Nothing is recorded or sent anywhere.
 */
(function () {
  "use strict";

  // ---------- conditions ----------
  // c1 Routine + Notifications, c2 Routine + Focus mode, c3 Infusion + Notifications, c4 Infusion + Focus mode
  var CONDITIONS = {
    k7p2: { id: 1, ai: "routine",  notif: "on",  c: "TTJINVhS" },
    m4x8: { id: 2, ai: "routine",  notif: "off", c: "RDNUOFFM" },
    t9b6: { id: 3, ai: "infusion", notif: "on",  c: "UDlDNk5a" },
    h3v5: { id: 4, ai: "infusion", notif: "off", c: "SzdXMlZH" }
  };
  function codeOf(cond) { return atob(cond.c).split("").reverse().join(""); }

  // ---------- content ----------
  var SIGN = "Best regards,\nBrightway Home Support";
  var EMAILS = [
    {
      first: "Maria", name: "Maria Lopez", initials: "ML", color: "#C2410C",
      addr: "maria.lopez@mailbox.com", time: "9:12 AM",
      subject: "Where is my order?",
      goal: "Tell Maria when her late order will arrive",
      body: "Hi,\n\nI ordered a blue table lamp on October 2, and it still has not arrived. The website said it would take 5 days.\n\nCan you tell me when I will get it?\n\nThanks,\nMaria",
      facts: [["Order number", "BW-20417"], ["Item", "Blue table lamp"], ["Status", "Delayed at our warehouse"], ["New delivery date", "October 18"]],
      template: "Hi [customer name],\n\nThank you for your email. I checked your order [order number]. It was delayed at our warehouse. Your new delivery date is [new delivery date].\n\nWe are sorry for the wait.\n\n" + SIGN,
      fill: { "[customer name]": "Maria", "[order number]": "BW-20417", "[new delivery date]": "October 18" },
      summary: ["Maria's order has not arrived.", "Order BW-20417, a blue table lamp.", "It is delayed. New delivery date: October 18.", "She wants to know when it will arrive."]
    },
    {
      first: "James", name: "James Carter", initials: "JC", color: "#0F766E",
      addr: "j.carter@inbox.net", time: "9:26 AM",
      subject: "My vase arrived broken",
      goal: "Tell James how he will get his money back",
      body: "Hello,\n\nMy ceramic vase arrived today, but it is broken into pieces. I am very disappointed.\n\nWhat can you do about this?\n\nJames",
      facts: [["Order number", "BW-19882"], ["Item", "Ceramic vase"], ["Problem", "Arrived broken"], ["What we do", "Full refund, no need to send it back"], ["Refund time", "3 to 5 business days"]],
      template: "Hi [customer name],\n\nThank you for letting us know. I am sorry that your item from order [order number] arrived broken. We will give you a full refund. You will get your money back in [refund time].\n\nYou do not need to send the item back.\n\n" + SIGN,
      fill: { "[customer name]": "James", "[order number]": "BW-19882", "[refund time]": "3 to 5 business days" },
      summary: ["James's vase arrived broken.", "Order BW-19882, a ceramic vase.", "He gets a full refund in 3 to 5 business days.", "He does not need to send the vase back."]
    },
    {
      first: "Priya", name: "Priya Shah", initials: "PS", color: "#7C3AED",
      addr: "priya.shah@webmail.com", time: "9:41 AM",
      subject: "Please change my delivery address",
      goal: "Tell Priya her delivery address is changed",
      body: "Hi there,\n\nI just moved. Can you please send my order to my new address?\n\n88 Pine Street, Denver, CO 80203\n\nThank you!\nPriya",
      facts: [["Order number", "BW-21056"], ["Item", "Kitchen towel set"], ["Status", "Not shipped yet, so the address can change"], ["New address", "88 Pine Street, Denver, CO 80203"]],
      template: "Hi [customer name],\n\nThank you for your message. Your order [order number] has not shipped yet, so I changed the delivery address to [new address].\n\nYou will get a tracking email when it ships.\n\n" + SIGN,
      fill: { "[customer name]": "Priya", "[order number]": "BW-21056", "[new address]": "88 Pine Street, Denver, CO 80203" },
      summary: ["Priya moved and wants a new delivery address.", "Order BW-21056, a kitchen towel set.", "It has not shipped yet, so the address can change.", "New address: 88 Pine Street, Denver, CO 80203."]
    }
  ];

  var NOTIFS = [
    { app: "Chat", kind: "chat", title: "Jordan Lee", text: "Hey! Are you coming to the team lunch on Friday?" },
    { app: "Calendar", kind: "cal", title: "Team meeting in 15 minutes", text: "Weekly team check-in, Room 2B" },
    { app: "Mail", kind: "mail", title: "IT Help Desk", text: "Reminder: please update your password by Friday." },
    { app: "Chat", kind: "chat", title: "Sam Rivera", text: "Can you send me the holiday schedule when you have a minute?" },
    { app: "System", kind: "sys", title: "Updates are ready", text: "Restart your computer to finish installing updates." },
    { app: "Mail", kind: "mail", title: "HR Team", text: "Benefits sign-up is now open. See the details inside." },
    { app: "Chat", kind: "chat", title: "Alex Kim", text: "Did you see the new parking rules for next week?" },
    { app: "Calendar", kind: "cal", title: "Weekly report due today", text: "Submit your weekly report by 5:00 PM." }
  ];

  var TOOLS = {
    summarize: { label: "Summarize email", hint: "See the key facts" },
    draft:     { label: "Draft reply", hint: "Get a first draft" },
    fill:      { label: "Fill in details", hint: "Add the facts to the draft" },
    friendly:  { label: "Make it friendlier", hint: "Improve the tone" },
    check:     { label: "Check my reply", hint: "Find mistakes before sending" }
  };
  var INF_TOOLS = ["summarize", "draft", "fill", "friendly", "check"];

  // ---------- icons ----------
  var ICON = {
    sparkle: '<svg viewBox="0 0 24 24"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z"/><path d="M18.5 15.5c.3 1.7 1.1 2.5 2.8 2.8-1.7.3-2.5 1.1-2.8 2.8-.3-1.7-1.1-2.5-2.8-2.8 1.7-.3 2.5-1.1 2.8-2.8z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" class="ic"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
    moon: '<svg viewBox="0 0 24 24" class="ic"><path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" class="ic"><path d="M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" class="ic"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8 6 8-6"/></svg>',
    cal: '<svg viewBox="0 0 24 24" class="ic"><path d="M4.5 6h15v13.5h-15zM4.5 10h15M8.5 4v4M15.5 4v4"/></svg>',
    sys: '<svg viewBox="0 0 24 24" class="ic"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4.5v4h-4"/></svg>',
    note: '<svg viewBox="0 0 24 24" class="ic"><path d="M5.5 4.5h13v15h-13z"/><path d="M9 9h6M9 12.5h6M9 16h3.5"/></svg>'
  };
  var NOTIF_COLORS = { chat: "#5B5FC7", mail: "#1D5BD8", cal: "#C2410C", sys: "#475569" };

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function show(id) { ["screen-error", "screen-intro", "screen-work", "screen-done"].forEach(function (s) { $(s).hidden = s !== id; }); window.scrollTo(0, 0); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  // ---------- state ----------
  var params = new URLSearchParams(location.search);
  var key = (params.get("s") || "").toLowerCase();
  var cond = CONDITIONS[key];
  var current = 0;
  var states = EMAILS.map(function () { return { used: {}, drafted: false, read: false }; });
  var busy = false;
  var notifTimer = null, notifIndex = 0, notifCount = 0;
  var audioCtx = null;
  var sessionRunning = false;

  if (!cond) { show("screen-error"); return; }
  if (store("bw-done-" + key) === "1") { finish(); return; }

  // ---------- condition cards ----------
  function aiCardHTML() {
    if (cond.ai === "routine") {
      return '<div class="cond-card card-ai">' +
        '<span class="tag">AI assistant</span>' +
        '<h3>' + ICON.sparkle + 'Standard mode</h3>' +
        '<p>The AI assistant does <strong>one fixed job</strong>: it writes a first draft of each reply.</p>' +
        '<p class="note">Use it the same way for every email:</p>' +
        '<ol><li>Click <span class="inline-btn">Draft reply</span></li>' +
        '<li>Fill in the parts in <mark>[brackets]</mark></li>' +
        '<li>Click <span class="inline-btn">Send</span></li></ol>' +
        '</div>';
    }
    return '<div class="cond-card card-ai">' +
      '<span class="tag">AI assistant</span>' +
      '<h3>' + ICON.sparkle + 'Full mode</h3>' +
      '<p>The AI assistant can help you with <strong>every step</strong>. It has 5 tools.</p>' +
      '<p class="note">Use all 5 tools for every email to get the most out of it:</p>' +
      '<ol>' + INF_TOOLS.map(function (t) { return '<li><span class="inline-btn">' + TOOLS[t].label + '</span> ' + TOOLS[t].hint.toLowerCase() + '</li>'; }).join("") + '</ol>' +
      '<p>Then click <span class="inline-btn">Send</span></p>' +
      '</div>';
  }
  function notifCardHTML() {
    if (cond.notif === "on") {
      return '<div class="cond-card card-on">' +
        '<span class="tag">Notifications</span>' +
        '<h3>' + ICON.bell + 'Notifications are ON</h3>' +
        '<p>While you work, <strong>messages, emails and reminders will pop up</strong>, just like at a real job.</p>' +
        '<p>Click <span class="inline-btn">Dismiss</span> to close each one. Then keep working.</p>' +
        '<p class="note">Please turn your sound on.</p>' +
        '</div>';
    }
    return '<div class="cond-card card-off">' +
      '<span class="tag">Notifications</span>' +
      '<h3>' + ICON.moon + 'Focus mode is ON</h3>' +
      '<p><strong>All notifications are paused.</strong> Nothing will pop up while you work.</p>' +
      '<p>You can focus on your emails without interruptions.</p>' +
      '</div>';
  }

  // ---------- intro ----------
  $("intro-cards").innerHTML = aiCardHTML() + notifCardHTML();
  $("intro-confirm").addEventListener("change", function () { $("btn-start").disabled = !this.checked; });
  $("btn-start").addEventListener("click", startSession);
  show("screen-intro");

  function startSession() {
    if (cond.notif === "on") {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
    }
    sessionRunning = true;
    setupChrome();
    show("screen-work");
    openEmail(0);
    if (cond.notif === "on") scheduleNotif(15000);
    window.addEventListener("beforeunload", warnLeave);
  }
  function warnLeave(e) { if (sessionRunning) { e.preventDefault(); e.returnValue = ""; } }

  // ---------- workspace chrome ----------
  function setupChrome() {
    $("pill-ai").innerHTML = '<svg viewBox="0 0 24 24" class="ic" style="fill:currentColor;stroke:none"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z"/></svg>AI: ' + (cond.ai === "routine" ? "Standard mode" : "Full mode");
    renderNotifPill();
    $("rail-status").className = "rail-status " + cond.notif;
    $("rail-status").innerHTML = cond.notif === "on" ? ICON.bell + "Notifications on" : ICON.moon + "Focus mode on";
    $("ai-mode").textContent = cond.ai === "routine" ? "Standard mode: drafts replies" : "Full mode: 5 tools";
    $("btn-guide").addEventListener("click", openGuide);
  }
  function renderNotifPill() {
    var p = $("pill-notif");
    if (cond.notif === "on") {
      p.className = "pill pill-on";
      p.innerHTML = ICON.bell + "Notifications on" + (notifCount ? ' <span class="badge">' + notifCount + "</span>" : "");
    } else {
      p.className = "pill pill-off";
      p.innerHTML = ICON.moon + "Focus mode on";
    }
  }
  function openGuide() {
    openModal("Your session guide",
      '<p class="lead">Reply to 3 customer emails. Your work session is set up like this:</p><div class="cond-cards">' + aiCardHTML() + notifCardHTML() + "</div>",
      [{ label: "Back to work", cls: "btn-primary btn-lg", fn: closeModal }], false);
  }

  // ---------- inbox list ----------
  function renderList() {
    $("mail-list").innerHTML = EMAILS.map(function (m, i) {
      var cls = i < current ? "done" : i === current ? "current" : "waiting";
      if (i >= current && !states[i].read) cls += " unread";
      var st = i < current ? "✓ Replied" : i === current ? "Reply now" : "Next";
      return '<li class="mail-item ' + cls + '">' +
        '<span class="avatar" style="background:' + m.color + '">' + m.initials + "</span>" +
        '<div><div class="from"><span class="nm">' + esc(m.name) + '</span><span class="muted small tm">' + m.time + "</span></div>" +
        '<div class="subj">' + esc(m.subject) + "</div>" +
        '<div class="state">' + st + "</div></div></li>";
    }).join("");
    var left = EMAILS.length - current;
    $("inbox-count").textContent = left;
    $("inbox-count").hidden = left <= 0;
  }

  // ---------- reader ----------
  function openEmail(i) {
    current = i;
    states[i].read = true;
    var m = EMAILS[i];
    renderList();
    $("task-count").textContent = "Email " + (i + 1) + " of " + EMAILS.length;
    $("task-goal").textContent = m.goal;

    $("reader").innerHTML =
      '<div class="mail-head"><span class="avatar" style="background:' + m.color + '">' + m.initials + "</span>" +
      '<div><div class="who">' + esc(m.name) + '</div><div class="addr">' + esc(m.addr) + " to Brightway Home Support, " + m.time + "</div></div></div>" +
      '<h1 class="mail-subject">' + esc(m.subject) + "</h1>" +
      '<div class="mail-body">' + esc(m.body) + "</div>" +
      '<div class="facts"><h3>' + ICON.note + "Order details</h3><dl>" +
      m.facts.map(function (f) { return "<dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd>"; }).join("") + "</dl></div>" +
      '<div class="composer" id="composer">' +
      '<div class="composer-head">Your reply to ' + esc(m.first) + "</div>" +
      '<textarea id="reply" aria-label="Your reply to ' + esc(m.first) + '" placeholder="' +
      (cond.ai === "routine" ? "Click Draft reply in the AI assistant to start." : "Use the AI assistant tools to write your reply.") + '"></textarea>' +
      '<div class="composer-foot"><div class="blanks" id="blanks"></div>' +
      '<button class="btn btn-primary btn-lg" id="btn-send">Send</button></div></div>' +
      '<div class="composer-error" id="send-error" role="alert" hidden></div>';
    $("reader").scrollTop = 0;

    $("reply").addEventListener("input", function () { $("send-error").hidden = true; refresh(); });
    $("btn-send").addEventListener("click", trySend);

    $("ai-log").innerHTML = "";
    if (cond.ai === "routine") {
      addBubble("New email from " + esc(m.first) + ". Click <strong>Draft reply</strong> and I will write a first draft for you.");
    } else {
      addBubble("New email from " + esc(m.first) + ". Let's use all 5 tools. Start with <strong>1. Summarize email</strong>.");
    }
    renderTools();
    refresh();
  }

  function blanksIn(text) { return text.match(/\[[^\]]*\]/g) || []; }

  // ---------- steps & tools ----------
  function stepList() {
    var s = states[current];
    var text = $("reply") ? $("reply").value : "";
    var filled = s.drafted && blanksIn(text).length === 0;
    if (cond.ai === "routine") {
      return [
        { label: "Draft reply", done: s.drafted },
        { label: "Fill in [brackets]", done: filled },
        { label: "Send", done: false }
      ];
    }
    return [
      { label: "Summarize", done: !!s.used.summarize },
      { label: "Draft reply", done: !!s.used.draft },
      { label: "Fill in details", done: !!s.used.fill || filled },
      { label: "Make friendlier", done: !!s.used.friendly },
      { label: "Check reply", done: !!s.used.check },
      { label: "Send", done: false }
    ];
  }

  function refresh() {
    var steps = stepList();
    var nextIdx = steps.findIndex(function (x) { return !x.done; });
    $("steps").innerHTML = steps.map(function (x, i) {
      return '<li class="' + (x.done ? "done" : i === nextIdx ? "next" : "") + '">' + esc(x.label) + "</li>";
    }).join("");

    var text = $("reply").value;
    var b = blanksIn(text);
    var el = $("blanks");
    if (!states[current].drafted && !text.trim()) {
      el.innerHTML = '<span class="muted">' + (cond.ai === "routine" ? "Start with Draft reply in the AI assistant." : "Start with the AI assistant tools.") + "</span>";
    } else if (b.length) {
      el.innerHTML = "<span>Fill in:</span>" + b.map(function (x) { return '<span class="blank-chip">' + esc(x) + "</span>"; }).join("");
    } else {
      el.innerHTML = '<span class="ok">✓ All details filled in</span>';
    }
    updateToolHighlight(nextIdx, steps);
  }

  function renderTools() {
    var box = $("ai-tools");
    if (cond.ai === "routine") {
      box.innerHTML = '<p class="tools-note"><b>Standard mode.</b> I draft your reply. You fill in the details and send it.</p>' +
        '<button class="btn btn-ai btn-draft-big" id="tool-draft">' + '<svg viewBox="0 0 24 24" class="ic" style="fill:#fff;stroke:none"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z"/></svg>Draft reply</button>';
      $("tool-draft").addEventListener("click", function () { runTool("draft"); });
      return;
    }
    box.innerHTML = '<p class="tools-note"><b>Full mode.</b> Use all 5 tools for every email.</p>' +
      '<ol class="tool-list">' + INF_TOOLS.map(function (t) {
        return '<li><button class="tool-btn" id="tool-' + t + '" data-tool="' + t + '"><span>' + TOOLS[t].label +
          "<small>" + TOOLS[t].hint + '</small></span><span class="used-tag"></span></button></li>';
      }).join("") + "</ol>" +
      '<div class="tools-count"><span id="tools-used">Tools used: 0 of 5</span><div class="meter"><span id="tools-meter" style="width:0"></span></div></div>';
    INF_TOOLS.forEach(function (t) { $("tool-" + t).addEventListener("click", function () { runTool(t); }); });
  }

  function updateToolHighlight(nextIdx, steps) {
    if (cond.ai === "routine") {
      $("tool-draft").classList.toggle("next", !states[current].drafted);
      $("tool-draft").disabled = busy;
      return;
    }
    var s = states[current];
    var n = 0;
    var nextTool = nextIdx >= 0 && nextIdx < INF_TOOLS.length ? INF_TOOLS[nextIdx] : null;
    INF_TOOLS.forEach(function (t) {
      var b = $("tool-" + t);
      var used = !!s.used[t];
      if (used) n++;
      b.classList.toggle("used", used);
      b.classList.toggle("next", t === nextTool);
      b.querySelector(".used-tag").textContent = used ? "Used" : "";
      b.disabled = busy;
    });
    $("tools-used").textContent = "Tools used: " + n + " of 5";
    $("tools-meter").style.width = (n / 5 * 100) + "%";
  }

  // ---------- AI log ----------
  function addBubble(html, cls) {
    var d = document.createElement("div");
    d.className = "bubble" + (cls ? " " + cls : "");
    d.innerHTML = html;
    $("ai-log").appendChild(d);
    $("ai-log").scrollTop = $("ai-log").scrollHeight;
    return d;
  }

  function runTool(t) {
    if (busy) return;
    busy = true;
    var idx = current;
    addBubble(esc(TOOLS[t].label), "user");
    var typing = addBubble("<i></i><i></i><i></i>", "typing");
    refresh();
    setTimeout(function () {
      typing.remove();
      busy = false;
      if (idx !== current) { refresh(); return; }
      doTool(t);
      refresh();
    }, 900);
  }

  function setReply(text) {
    $("reply").value = text;
    var c = $("composer");
    c.classList.remove("flash"); void c.offsetWidth; c.classList.add("flash");
    $("send-error").hidden = true;
  }

  function doTool(t) {
    var m = EMAILS[current], s = states[current], ta = $("reply");
    var text = ta.value;
    if (t === "summarize") {
      s.used.summarize = true;
      addBubble("<strong>Summary</strong><ul>" + m.summary.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>");
    } else if (t === "draft") {
      s.used.draft = true;
      s.drafted = true;
      setReply(m.template);
      addBubble(cond.ai === "routine"
        ? "Here is your draft. Now <strong>fill in the parts in [brackets]</strong>. You can find the details in the email and in Order details. Then click Send."
        : "I put a draft in your reply box. Next, use <strong>3. Fill in details</strong>.");
    } else if (t === "fill") {
      if (!s.drafted && blanksIn(text).length === 0) {
        addBubble("Please use <strong>2. Draft reply</strong> first. Then I can fill in the details.");
        return;
      }
      var before = blanksIn(text).length;
      Object.keys(m.fill).forEach(function (k) { text = text.split(k).join(m.fill[k]); });
      s.used.fill = true;
      setReply(text);
      addBubble(before ? "I filled in the details from the email and Order details. Next, use <strong>4. Make it friendlier</strong>."
                       : "All details are already filled in. Next, use <strong>4. Make it friendlier</strong>.");
    } else if (t === "friendly") {
      if (!text.trim()) { addBubble("Your reply is empty. Please use <strong>2. Draft reply</strong> first."); return; }
      s.used.friendly = true;
      if (/Warm regards/.test(text)) {
        addBubble("Your reply already sounds friendly. Next, use <strong>5. Check my reply</strong>.");
        return;
      }
      var warm = "Please let me know if there is anything else I can do for you. Have a wonderful day!";
      if (text.indexOf("Best regards,") !== -1) {
        text = text.replace("Best regards,", warm + "\n\nWarm regards,");
      } else {
        text = text.replace(/\s*$/, "") + "\n\n" + warm + "\n\nWarm regards,\nBrightway Home Support";
      }
      text = text.replace(/^(Hi [^\n]*,)/, "$1\n\nI hope you are doing well.");
      setReply(text);
      addBubble("I made your reply warmer and more friendly. Next, use <strong>5. Check my reply</strong>.");
    } else if (t === "check") {
      if (!text.trim()) { addBubble("Your reply is empty. Please use <strong>2. Draft reply</strong> first."); return; }
      s.used.check = true;
      var checks = [
        ["Uses the customer's name", text.indexOf(m.first) !== -1],
        ["Has the order number", text.indexOf(m.fill["[order number]"]) !== -1],
        ["No empty [brackets] left", blanksIn(text).length === 0],
        ["Friendly tone", /Warm regards|wonderful|happy to help/i.test(text)]
      ];
      var ok = checks.every(function (c) { return c[1]; });
      addBubble("<strong>Check results</strong><ul>" + checks.map(function (c) {
        return '<li><span class="' + (c[1] ? "check-yes" : "check-no") + '">' + (c[1] ? "✓" : "✗") + "</span> " + c[0] + "</li>";
      }).join("") + "</ul>" + (ok ? "Your reply is ready. Click <strong>Send</strong>." : "Please fix the items marked ✗, then click <strong>Send</strong>."));
    }
  }

  // ---------- sending ----------
  function sendError(msg) {
    var e = $("send-error");
    e.innerHTML = msg;
    e.hidden = false;
    e.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function trySend() {
    var s = states[current], text = $("reply").value;
    if (!s.drafted) {
      sendError(cond.ai === "routine" ? "First click Draft reply in the AI assistant." : "First use the AI assistant: start with Summarize email, then Draft reply.");
      return;
    }
    if (blanksIn(text).length) {
      sendError("Fill in the parts in [brackets] first. You can find the details in Order details." + (cond.ai === "infusion" ? " Tip: use Fill in details." : ""));
      return;
    }
    if (text.trim().length < 40) { sendError("Your reply is too short. Please write a full reply."); return; }
    if (cond.ai === "infusion") {
      var missing = INF_TOOLS.filter(function (t) { return !s.used[t]; });
      if (missing.length) {
        openModal("You have not used all 5 AI tools yet",
          '<p class="lead">You used ' + (5 - missing.length) + " of 5 tools for this email. In Full mode, use all tools to get the most out of your AI assistant.</p>" +
          "<p>Not used yet: " + missing.map(function (t) { return '<span class="inline-btn">' + TOOLS[t].label + "</span>"; }).join(" ") + "</p>",
          [{ label: "Send anyway", cls: "btn-ghost btn-lg", fn: function () { closeModal(); doSend(); } },
           { label: "Use the missing tools", cls: "btn-ai btn-lg", fn: function () { closeModal(); var b = $("tool-" + missing[0]); if (b) b.focus(); } }], true);
        return;
      }
    }
    doSend();
  }

  function doSend() {
    $("btn-send").disabled = true;
    $("reply").readOnly = true;
    toast("✓ Reply sent to " + EMAILS[current].first);
    setTimeout(function () {
      if (current + 1 < EMAILS.length) {
        current++;
        openEmail(current);
      } else {
        current = EMAILS.length;
        finish();
      }
    }, 1400);
  }

  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.hidden = true; }, 1800);
  }

  // ---------- notifications ----------
  function scheduleNotif(ms) {
    clearTimeout(notifTimer);
    notifTimer = setTimeout(showNotif, ms);
  }
  function showNotif() {
    if (!sessionRunning) return;
    if (!$("modal-shade").hidden) { scheduleNotif(3000); return; }
    var n = NOTIFS[notifIndex % NOTIFS.length];
    notifIndex++;
    notifCount++;
    renderNotifPill();
    $("notif-app").textContent = n.app;
    $("notif-icon").innerHTML = ICON[n.kind];
    $("notif-icon").style.background = NOTIF_COLORS[n.kind];
    $("notif-title").textContent = n.title;
    $("notif-body").textContent = n.text;
    $("notif-shade").hidden = false;
    $("notif").hidden = false;
    $("notif").style.animation = "none"; void $("notif").offsetWidth; $("notif").style.animation = "";
    chime();
    $("notif-dismiss").focus();
  }
  $("notif-dismiss").addEventListener("click", function () {
    $("notif").hidden = true;
    $("notif-shade").hidden = true;
    if ($("reply")) $("reply").focus({ preventScroll: true });
    scheduleNotif(rand(40000, 60000));
  });
  function chime() {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === "suspended") audioCtx.resume();
      var t0 = audioCtx.currentTime;
      [[880, 0], [1320, 0.16]].forEach(function (p) {
        var o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.value = p[0];
        g.gain.setValueAtTime(0.0001, t0 + p[1]);
        g.gain.exponentialRampToValueAtTime(0.25, t0 + p[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + p[1] + 0.35);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t0 + p[1]); o.stop(t0 + p[1] + 0.4);
      });
    } catch (e) { /* sound is optional */ }
  }

  // ---------- modal ----------
  function openModal(title, bodyHTML, actions, small) {
    $("modal-title").textContent = title;
    $("modal-body").innerHTML = bodyHTML;
    var box = $("modal-actions");
    box.innerHTML = "";
    actions.forEach(function (a) {
      var b = document.createElement("button");
      b.className = "btn " + a.cls;
      b.textContent = a.label;
      b.addEventListener("click", a.fn);
      box.appendChild(b);
    });
    document.querySelector(".modal").classList.toggle("small-modal", !!small);
    $("modal-shade").hidden = false;
    box.lastChild.focus();
  }
  function closeModal() { $("modal-shade").hidden = true; }

  // ---------- finish ----------
  function finish() {
    sessionRunning = false;
    clearTimeout(notifTimer);
    $("notif").hidden = true;
    $("notif-shade").hidden = true;
    window.removeEventListener("beforeunload", warnLeave);
    store("bw-done-" + key, "1");
    var code = codeOf(cond);
    $("done-code").textContent = code;
    $("btn-copy").onclick = function () {
      var btn = this;
      function ok() { btn.textContent = "Copied ✓"; setTimeout(function () { btn.textContent = "Copy code"; }, 2000); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(ok, fallback);
      } else { fallback(); }
      function fallback() {
        var r = document.createRange(); r.selectNodeContents($("done-code"));
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        try { document.execCommand("copy"); ok(); } catch (e) { btn.textContent = "Select and copy the code"; }
      }
    };
    show("screen-done");
  }
})();
