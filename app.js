/* Brightway Mail: work-session simulation for a 2 x 2 online experiment.
 * Factor 1 (Type of AI use): routine = Standard mode (one fixed function in the team's standard routine),
 *                            infusion = Full mode (five tools, use all of them for every email)
 * Factor 2 (Work interruptions): on = Notifications (pop-ups, some need a quick reply), off = Focus mode
 * Condition is read from the URL: index.html?s=<key>. Nothing is recorded or sent anywhere.
 */
(function () {
  "use strict";

  // ---------- conditions ----------
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
      subject: "Where is my order?", preview: "I ordered a blue table lamp on October 2, and it still has not arrived...",
      goal: "Tell Maria when her late order will arrive",
      body: "Hi,\n\nI ordered a blue table lamp on October 2, and it still has not arrived. The website said it would take 5 days.\n\nCan you tell me when I will get it?\n\nThanks,\nMaria",
      facts: [["Order number", "BW-20417"], ["Item", "Blue table lamp"], ["Status", "Delayed at our warehouse"], ["New delivery date", "October 18"]],
      policy: "Delayed orders: tell the customer the new delivery date and apologize for the wait.",
      template: "Hi [customer name],\n\nThank you for your email. I checked your order [order number]. It was delayed at our warehouse. Your new delivery date is [new delivery date].\n\nWe are sorry for the wait.\n\n" + SIGN,
      fill: { "[customer name]": "Maria", "[order number]": "BW-20417", "[new delivery date]": "October 18" },
      summary: ["Maria's order has not arrived.", "She wants to know when it will arrive.", "She sounds a little worried."]
    },
    {
      first: "James", name: "James Carter", initials: "JC", color: "#0F766E",
      addr: "j.carter@inbox.net", time: "9:26 AM",
      subject: "My vase arrived broken", preview: "My ceramic vase arrived today, but it is broken into pieces...",
      goal: "Tell James how he will get his money back",
      body: "Hello,\n\nMy ceramic vase arrived today, but it is broken into pieces. I am very disappointed.\n\nWhat can you do about this?\n\nJames",
      facts: [["Order number", "BW-19882"], ["Item", "Ceramic vase"], ["Problem", "Arrived broken"], ["What we do", "Full refund, no need to send it back"], ["Refund time", "3 to 5 business days"]],
      policy: "Broken items: give a full refund. The customer does not need to return the item.",
      template: "Hi [customer name],\n\nThank you for letting us know. I am sorry that your item from order [order number] arrived broken. We will give you a full refund. You will get your money back in [refund time].\n\nYou do not need to send the item back.\n\n" + SIGN,
      fill: { "[customer name]": "James", "[order number]": "BW-19882", "[refund time]": "3 to 5 business days" },
      summary: ["James's vase arrived broken.", "He is disappointed and wants a solution.", "He is asking what we can do."]
    },
    {
      first: "Priya", name: "Priya Shah", initials: "PS", color: "#7C3AED",
      addr: "priya.shah@webmail.com", time: "9:41 AM",
      subject: "Please change my delivery address", preview: "I just moved. Can you please send my order to my new address?...",
      goal: "Tell Priya her delivery address is changed",
      body: "Hi there,\n\nI just moved. Can you please send my order to my new address?\n\n88 Pine Street, Denver, CO 80203\n\nThank you!\nPriya",
      facts: [["Order number", "BW-21056"], ["Item", "Kitchen towel set"], ["Status", "Not shipped yet, so the address can change"], ["New address", "88 Pine Street, Denver, CO 80203"]],
      policy: "Address changes: allowed only before the order ships. Confirm the new address in the reply.",
      template: "Hi [customer name],\n\nThank you for your message. Your order [order number] has not shipped yet, so I changed the delivery address to [new address].\n\nYou will get a tracking email when it ships.\n\n" + SIGN,
      fill: { "[customer name]": "Priya", "[order number]": "BW-21056", "[new address]": "88 Pine Street, Denver, CO 80203" },
      summary: ["Priya moved to a new home.", "She wants her order sent to her new address.", "She gave the new address in her email."]
    }
  ];
  var OLD_MAIL = [
    { name: "Dana Brooks", initials: "DB", color: "#B4235A", time: "8:58 AM", subject: "Today's plan", preview: "Hi! Today you will answer 3 customer emails..." },
    { name: "IT Help Desk", initials: "IT", color: "#475569", time: "Yesterday", subject: "Brightway Assist is now in your mailbox", preview: "The AI assistant now appears on the right side of Brightway Mail..." },
    { name: "Sam Rivera", initials: "SR", color: "#0E7490", time: "Yesterday", subject: "Shift swap next week", preview: "Thanks for switching shifts with me on Tuesday!" }
  ];

  // Notifications: some need a quick reply (stronger, more realistic interruption)
  var NOTIFS = [
    { app: "Chat", kind: "chat", who: "Dana Brooks", initials: "DB", color: "#B4235A", text: "Quick check: can you take the 3 PM customer call today?", replies: ["Yes, I can", "Sorry, not today"] },
    { app: "Calendar", kind: "cal", who: "Team huddle in 15 minutes", text: "Room 2B and online" },
    { app: "Mail", kind: "mail", who: "IT Help Desk", text: "Your password expires in 3 days. Please update it soon." },
    { app: "Chat", kind: "chat", who: "Sam Rivera", initials: "SR", color: "#0E7490", text: "Do you know where the holiday schedule file is?", replies: ["In the team folder", "Not sure, sorry"] },
    { app: "System", kind: "sys", who: "Updates are ready", text: "Restart your computer to finish installing updates." },
    { app: "Chat", kind: "chat", who: "Alex Kim", initials: "AK", color: "#9333EA", text: "Are you joining the team lunch on Friday?", replies: ["Yes!", "Can't this week"] },
    { app: "Mail", kind: "mail", who: "HR Team", text: "Benefits sign-up closes on Friday." }
  ];

  var TOOLS = {
    summarize: { label: "Summarize email", hint: "See what the customer needs" },
    lookup:    { label: "Look up order & policy", hint: "Find the order facts and the rule to follow" },
    draft:     { label: "Draft reply", hint: "Write a full reply" },
    tone:      { label: "Improve tone", hint: "Make the reply warmer" },
    check:     { label: "Check my reply", hint: "Catch mistakes before sending" }
  };
  var INF_TOOLS = ["summarize", "lookup", "draft", "tone", "check"];

  // ---------- icons ----------
  var SPARK = '<svg viewBox="0 0 24 24"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z"/><path d="M18.5 15.5c.3 1.7 1.1 2.5 2.8 2.8-1.7.3-2.5 1.1-2.8 2.8-.3-1.7-1.1-2.5-2.8-2.8 1.7-.3 2.5-1.1 2.8-2.8z"/></svg>';
  var ICON = {
    bell: '<svg viewBox="0 0 24 24" class="ic"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
    moon: '<svg viewBox="0 0 24 24" class="ic"><path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" class="ic"><path d="M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" class="ic"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8 6 8-6"/></svg>',
    cal: '<svg viewBox="0 0 24 24" class="ic"><path d="M4.5 6h15v13.5h-15zM4.5 10h15M8.5 4v4M15.5 4v4"/></svg>',
    sys: '<svg viewBox="0 0 24 24" class="ic"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4.5v4h-4"/></svg>',
    note: '<svg viewBox="0 0 24 24" class="ic"><path d="M5.5 4.5h13v15h-13z"/><path d="M9 9h6M9 12.5h6M9 16h3.5"/></svg>'
  };
  var APP_COLORS = { chat: "#5B5FC7", mail: "#1556C6", cal: "#C2410C", sys: "#475569" };

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
  var busy = false, sentCount = 0;
  var notifTimer = null, notifIndex = 0, notifCount = 0, focusTimer = null, startTime = 0;
  var audioCtx = null, sessionRunning = false;

  if (!cond) { show("screen-error"); return; }
  if (store("bw-done-" + key) === "1") { finish(); return; }

  var AI_LABEL = cond.ai === "routine" ? "Standard mode: one AI function (Draft reply)" : "Full mode: five AI tools";
  var NOTIF_LABEL = cond.notif === "on" ? "Notifications ON: pop-up messages will appear" : "Focus mode ON: no pop-up messages";

  // ---------- team lead message + setup ----------
  function leadMessageHTML() {
    var h = "<p>Hi! Today you will answer <b>3 customer emails</b> in our inbox. It takes about 5 minutes.</p>";
    if (cond.ai === "routine") {
      h += "<p><b>Our AI assistant is in Standard mode.</b> Our team has one standard routine, and the assistant has <b>one function: Draft reply</b>. Please use it the same way for every email:</p>" +
        "<ol><li>Click <span class=\"chip chip-ai\">Draft reply</span>.</li><li>Fill in the parts in <mark>[brackets]</mark> using the Order details box.</li><li>Click <span class=\"chip\">Send</span>.</li></ol>";
    } else {
      h += "<p><b>Our AI assistant is in Full mode.</b> It has <b>five tools</b>, and I would like you to get the most out of it. Please use <b>all five tools for every email</b>:</p>" +
        "<ol>" + INF_TOOLS.map(function (t) { return "<li><span class=\"chip chip-ai\">" + TOOLS[t].label + "</span> " + TOOLS[t].hint.toLowerCase() + "</li>"; }).join("") + "</ol>" +
        "<p>Then click <span class=\"chip\">Send</span>.</p>";
    }
    if (cond.notif === "on") {
      h += "<p><b>Notifications are ON today.</b> Chat messages, emails and reminders will pop up while you work, like on a normal day. Close each one or answer it quickly, then keep working. Please turn your sound on.</p>";
    } else {
      h += "<p><b>I turned on Focus mode for you.</b> All notifications are paused, so nothing will pop up while you work.</p>";
    }
    return h + "<p>Thanks!<br>Dana</p>";
  }
  function setupHTML() {
    var ai = '<div class="setup-card sc-ai"><span class="sc-icon">' + SPARK + '</span><div><div class="sc-label">AI assistant</div>' +
      '<div class="sc-value">' + (cond.ai === "routine" ? "Standard mode" : "Full mode") + '</div>' +
      '<p>' + (cond.ai === "routine" ? "One AI function (Draft reply), used the same way for every email." : "Five AI tools. Use all of them for every email.") + '</p></div></div>';
    var nt = cond.notif === "on"
      ? '<div class="setup-card sc-on"><span class="sc-icon">' + ICON.bell + '</span><div><div class="sc-label">Notifications</div><div class="sc-value">Notifications ON</div><p>Pop-up messages will appear while you work.</p></div></div>'
      : '<div class="setup-card sc-off"><span class="sc-icon">' + ICON.moon + '</span><div><div class="sc-label">Notifications</div><div class="sc-value">Focus mode ON</div><p>No pop-up messages while you work.</p></div></div>';
    return ai + nt;
  }

  $("lead-msg-body").innerHTML = leadMessageHTML();
  $("setup-grid").innerHTML = setupHTML();
  $("intro-confirm").addEventListener("change", function () { $("btn-start").disabled = !this.checked; });
  $("btn-start").addEventListener("click", startSession);
  show("screen-intro");

  function startSession() {
    if (cond.notif === "on") { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; } }
    sessionRunning = true;
    startTime = Date.now();
    setupChrome();
    show("screen-work");
    openEmail(0);
    if (cond.notif === "on") scheduleNotif(12000);
    else focusTimer = setInterval(renderStatus, 1000);
    window.addEventListener("beforeunload", warnLeave);
  }
  function warnLeave(e) { if (sessionRunning) { e.preventDefault(); e.returnValue = ""; } }

  // ---------- chrome ----------
  function setupChrome() {
    $("status-ai").innerHTML = '<svg viewBox="0 0 24 24" class="ic" style="fill:currentColor;stroke:none"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z"/></svg>AI: ' + (cond.ai === "routine" ? "Standard mode" : "Full mode");
    renderStatus();
    var fs = $("folder-status");
    fs.className = "folder-status " + cond.notif;
    fs.innerHTML = cond.notif === "on" ? ICON.bell + "<span>Notifications on<br><span style='font-weight:400'>Pop-ups will appear</span></span>" : ICON.moon + "<span>Focus mode on<br><span style='font-weight:400'>Notifications paused</span></span>";
    $("ai-mode").textContent = cond.ai === "routine" ? "Standard mode: Draft reply" : "Full mode: 5 tools";
    $("btn-guide").addEventListener("click", openGuide);
  }
  function renderStatus() {
    var p = $("status-notif");
    if (cond.notif === "on") {
      p.className = "status on";
      p.innerHTML = ICON.bell + "Notifications on" + (notifCount ? ' <span class="badge">' + notifCount + "</span>" : "");
    } else {
      var sec = Math.floor((Date.now() - startTime) / 1000);
      var mm = String(Math.floor(sec / 60)).padStart(2, "0"), ss = String(sec % 60).padStart(2, "0");
      p.className = "status off";
      p.innerHTML = ICON.moon + "Focus mode on <span class=\"timer\">" + mm + ":" + ss + "</span>";
    }
  }
  function openGuide() {
    openModal("Message from Dana",
      '<article class="lead-msg"><div class="lead-msg-head"><span class="avatar" style="background:#B4235A">DB</span><div><div class="who">Dana Brooks <span class="role">Team Lead</span></div><div class="muted small">8:58 AM</div></div></div><div class="lead-msg-body">' + leadMessageHTML() + "</div></article>",
      [{ label: "Back to work", cls: "btn-primary btn-lg", fn: closeModal }], false);
  }

  // ---------- inbox ----------
  function renderList() {
    var h = EMAILS.map(function (m, i) {
      var cls = i < current ? "done" : i === current ? "current" : "waiting";
      if (i >= current && !states[i].read) cls += " unread";
      var st = i < current ? "✓ Replied" : i === current ? "Reply now" : "Next";
      return '<li class="mail-item ' + cls + '"><span class="avatar" style="background:' + m.color + '">' + m.initials + "</span>" +
        '<div><div class="from"><span class="nm">' + esc(m.name) + '</span><span class="tm">' + m.time + "</span></div>" +
        '<div class="subj">' + esc(m.subject) + '</div><div class="prev">' + esc(m.preview) + '</div><div class="state">' + st + "</div></div></li>";
    }).join("");
    h += '<li class="list-divider">Earlier</li>' + OLD_MAIL.map(function (m) {
      return '<li class="mail-item old"><span class="avatar" style="background:' + m.color + '">' + m.initials + "</span>" +
        '<div><div class="from"><span class="nm">' + esc(m.name) + '</span><span class="tm">' + m.time + "</span></div>" +
        '<div class="subj">' + esc(m.subject) + '</div><div class="prev">' + esc(m.preview) + "</div></div></li>";
    }).join("");
    $("mail-list").innerHTML = h;
    var left = EMAILS.length - current;
    $("inbox-count").textContent = left > 0 ? left : "";
    $("sent-count").textContent = sentCount ? sentCount : "";
  }

  // ---------- reader ----------
  function openEmail(i) {
    current = i; states[i].read = true;
    var m = EMAILS[i];
    renderList();
    $("task-count").textContent = "Email " + (i + 1) + " of " + EMAILS.length;
    $("task-goal").textContent = m.goal;
    $("steps-label").textContent = cond.ai === "routine" ? "Team routine:" : "Use all 5 AI tools:";
    $("reader").innerHTML =
      '<h1 class="mail-subject">' + esc(m.subject) + "</h1>" +
      '<div class="mail-head"><span class="avatar" style="background:' + m.color + '">' + m.initials + "</span>" +
      '<div><div class="who">' + esc(m.name) + '</div><div class="addr">&lt;' + esc(m.addr) + "&gt; to Brightway Home Support</div></div>" +
      '<span class="when">Today, ' + m.time + "</span></div>" +
      '<div class="mail-body">' + esc(m.body) + "</div>" +
      '<div class="facts" id="facts"><h3>' + ICON.note + 'Order details <span class="src">from the order system</span></h3><dl>' +
      m.facts.map(function (f) { return "<dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd>"; }).join("") + "</dl></div>" +
      '<div class="composer" id="composer">' +
      '<div class="composer-head"><span class="to">To</span><span class="to-chip">' + esc(m.name) + "</span></div>" +
      '<div class="composer-sub">RE: ' + esc(m.subject) + "</div>" +
      '<textarea id="reply" aria-label="Your reply to ' + esc(m.first) + '" placeholder="' +
      (cond.ai === "routine" ? "Follow the team routine: click Draft reply in Brightway Assist." : "Use the AI tools in Brightway Assist to write your reply.") + '"></textarea>' +
      '<div class="composer-foot"><div class="blanks" id="blanks"></div>' +
      '<button class="btn btn-primary btn-lg" id="btn-send"><svg viewBox="0 0 24 24" class="ic"><path d="m4 12 16-7-6 15-2.5-5.5z"/></svg>Send</button></div></div>' +
      '<div class="composer-error" id="send-error" role="alert" hidden></div>';
    $("reader").scrollTop = 0;
    $("reply").addEventListener("input", function () { $("send-error").hidden = true; refresh(); });
    $("btn-send").addEventListener("click", trySend);
    $("ai-log").innerHTML = "";
    if (cond.ai === "routine") addBubble("New email from " + esc(m.first) + ". Standard routine: click <strong>Draft reply</strong> and I will write a first draft with [brackets] for you to fill in.");
    else addBubble("New email from " + esc(m.first) + ". Let's use all 5 tools. Start with <strong>1. Summarize email</strong>.");
    renderTools();
    refresh();
  }
  function blanksIn(text) { return text.match(/\[[^\]]*\]/g) || []; }

  // ---------- steps & tools ----------
  function stepList() {
    var s = states[current], text = $("reply") ? $("reply").value : "";
    var filled = s.drafted && blanksIn(text).length === 0;
    if (cond.ai === "routine") return [{ label: "Draft reply", done: s.drafted }, { label: "Fill in [brackets]", done: filled }, { label: "Send", done: false }];
    return [
      { label: "Summarize", done: !!s.used.summarize }, { label: "Look up", done: !!s.used.lookup },
      { label: "Draft", done: !!s.used.draft }, { label: "Improve tone", done: !!s.used.tone },
      { label: "Check", done: !!s.used.check }, { label: "Send", done: false }];
  }
  function refresh() {
    var steps = stepList();
    var nextIdx = steps.findIndex(function (x) { return !x.done; });
    $("steps").innerHTML = steps.map(function (x, i) { return '<li class="' + (x.done ? "done" : i === nextIdx ? "next" : "") + '">' + esc(x.label) + "</li>"; }).join("");
    var text = $("reply").value, b = blanksIn(text), el = $("blanks");
    if (!states[current].drafted && !text.trim()) el.innerHTML = '<span class="muted">' + (cond.ai === "routine" ? "Start with Draft reply." : "Start with the AI tools.") + "</span>";
    else if (b.length) el.innerHTML = "<span>Fill in:</span>" + b.map(function (x) { return '<span class="blank-chip">' + esc(x) + "</span>"; }).join("");
    else el.innerHTML = '<span class="ok">✓ All details filled in</span>';
    updateToolHighlight(nextIdx);
  }
  function renderTools() {
    var box = $("ai-tools");
    if (cond.ai === "routine") {
      box.innerHTML = '<div class="routine-box"><b>Standard mode</b>: our team routine for every email<ol id="routine-ol"><li>Draft reply (AI)</li><li>Fill in the [brackets]</li><li>Send</li></ol></div>' +
        '<button class="btn btn-ai btn-draft-big" id="tool-draft"><svg viewBox="0 0 24 24" class="ic" style="fill:#fff;stroke:none"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z"/></svg>Draft reply</button>';
      $("tool-draft").addEventListener("click", function () { runTool("draft"); });
      return;
    }
    box.innerHTML = '<p class="tools-note"><b>Full mode</b>: use all 5 tools for every email.</p><ol class="tool-list">' +
      INF_TOOLS.map(function (t) { return '<li><button class="tool-btn" id="tool-' + t + '"><span>' + TOOLS[t].label + "<small>" + TOOLS[t].hint + '</small></span><span class="used-tag"></span></button></li>'; }).join("") +
      '</ol><div class="tools-count"><span id="tools-used">Tools used: 0 of 5</span><div class="meter"><span id="tools-meter" style="width:0"></span></div></div>';
    INF_TOOLS.forEach(function (t) { $("tool-" + t).addEventListener("click", function () { runTool(t); }); });
  }
  function updateToolHighlight(nextIdx) {
    if (cond.ai === "routine") {
      var s0 = states[current], text = $("reply").value;
      $("tool-draft").classList.toggle("next", !s0.drafted);
      $("tool-draft").disabled = busy;
      var step = !s0.drafted ? 0 : blanksIn(text).length ? 1 : 2;
      [].forEach.call($("routine-ol").children, function (li, i) { li.className = i === step ? "cur" : ""; });
      return;
    }
    var s = states[current], n = 0;
    var nextTool = nextIdx >= 0 && nextIdx < INF_TOOLS.length ? INF_TOOLS[nextIdx] : null;
    INF_TOOLS.forEach(function (t) {
      var b = $("tool-" + t), used = !!s.used[t];
      if (used) n++;
      b.classList.toggle("used", used); b.classList.toggle("next", t === nextTool);
      b.querySelector(".used-tag").textContent = used ? "Used" : "";
      b.disabled = busy;
    });
    $("tools-used").textContent = "Tools used: " + n + " of 5";
    $("tools-meter").style.width = (n / 5 * 100) + "%";
  }

  // ---------- AI ----------
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
      if (idx !== current) { busy = false; refresh(); return; }
      doTool(t, function () { busy = false; refresh(); });
    }, 850);
  }
  function streamInto(text, done) {
    var ta = $("reply"), i = 0, step = Math.max(6, Math.ceil(text.length / 45));
    var c = $("composer"); c.classList.remove("flash"); void c.offsetWidth; c.classList.add("flash");
    $("send-error").hidden = true;
    (function tick() {
      i = Math.min(text.length, i + step);
      ta.value = text.slice(0, i);
      ta.scrollTop = ta.scrollHeight;
      if (i < text.length) setTimeout(tick, 18); else { ta.scrollTop = 0; done && done(); }
    })();
  }
  function fillText(text, m) { Object.keys(m.fill).forEach(function (k) { text = text.split(k).join(m.fill[k]); }); return text; }

  function doTool(t, done) {
    var m = EMAILS[current], s = states[current], text = $("reply").value;
    if (t === "summarize") {
      s.used.summarize = true;
      addBubble("<strong>Summary</strong><ul>" + m.summary.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>Next: <strong>2. Look up order &amp; policy</strong>.");
      return done();
    }
    if (t === "lookup") {
      s.used.lookup = true;
      var f = $("facts"); f.classList.add("glow"); setTimeout(function () { f.classList.remove("glow"); }, 1600);
      addBubble("<strong>Order &amp; policy</strong><div class=\"kv\">" + m.facts.map(function (x) { return "<span>" + esc(x[0]) + "</span><b>" + esc(x[1]) + "</b>"; }).join("") +
        "</div><p style=\"margin:.5em 0 0\"><b>Policy:</b> " + esc(m.policy) + "</p>" +
        (blanksIn(text).length ? "" : "<p style=\"margin:.4em 0 0\">Next: <strong>3. Draft reply</strong>. I will use these facts.</p>"));
      if (blanksIn(text).length) { streamInto(fillText(text, m), function () { addBubble("I filled in the details in your draft. Next: <strong>4. Improve tone</strong>."); done(); }); return; }
      return done();
    }
    if (t === "draft") {
      s.used.draft = true; s.drafted = true;
      if (cond.ai === "routine") {
        streamInto(m.template, function () { addBubble("Here is the standard draft. Now <strong>fill in the parts in [brackets]</strong> using the Order details box, then click Send."); done(); });
      } else if (s.used.lookup) {
        streamInto(fillText(m.template, m), function () { addBubble("I wrote a full reply using the order facts and policy. Next: <strong>4. Improve tone</strong>."); done(); });
      } else {
        streamInto(m.template, function () { addBubble("I wrote a draft, but I do not have the order facts yet, so some parts are in [brackets]. Use <strong>2. Look up order &amp; policy</strong> and I will fill them in."); done(); });
      }
      return;
    }
    if (t === "tone") {
      if (!text.trim()) { addBubble("Your reply is empty. Please use <strong>3. Draft reply</strong> first."); return done(); }
      s.used.tone = true;
      if (/Warm regards/.test(text)) { addBubble("Your reply already sounds warm and friendly. Next: <strong>5. Check my reply</strong>."); return done(); }
      var warm = "Please let me know if there is anything else I can do for you. Have a wonderful day!";
      text = text.indexOf("Best regards,") !== -1 ? text.replace("Best regards,", warm + "\n\nWarm regards,") : text.replace(/\s*$/, "") + "\n\n" + warm + "\n\nWarm regards,\nBrightway Home Support";
      text = text.replace(/^(Hi [^\n]*,)/, "$1\n\nI hope you are doing well.");
      streamInto(text, function () { addBubble("I made your reply warmer and more personal. Next: <strong>5. Check my reply</strong>."); done(); });
      return;
    }
    if (t === "check") {
      if (!text.trim()) { addBubble("Your reply is empty. Please use <strong>3. Draft reply</strong> first."); return done(); }
      s.used.check = true;
      var checks = [
        ["Uses the customer's name", text.indexOf(m.first) !== -1],
        ["Has the order number", text.indexOf(m.fill["[order number]"]) !== -1],
        ["No empty [brackets] left", blanksIn(text).length === 0],
        ["Follows the policy", blanksIn(text).length === 0],
        ["Warm, polite tone", /Warm regards|wonderful|happy to help/i.test(text)]
      ];
      var ok = checks.every(function (c) { return c[1]; });
      addBubble("<strong>Check results</strong><ul>" + checks.map(function (c) { return '<li><span class="' + (c[1] ? "check-yes" : "check-no") + '">' + (c[1] ? "✓" : "✗") + "</span> " + c[0] + "</li>"; }).join("") +
        "</ul>" + (ok ? "Your reply is ready. Click <strong>Send</strong>." : "Please fix the items marked ✗, then click <strong>Send</strong>."));
      return done();
    }
    done();
  }

  // ---------- sending ----------
  function sendError(msg) { var e = $("send-error"); e.innerHTML = msg; e.hidden = false; e.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
  function trySend() {
    if (busy) return;
    var s = states[current], text = $("reply").value;
    if (!s.drafted) { sendError(cond.ai === "routine" ? "Follow the team routine: first click Draft reply in Brightway Assist." : "First use the AI tools: start with Summarize email."); return; }
    if (blanksIn(text).length) { sendError("Fill in the parts in [brackets] first. You can find the details in the Order details box." + (cond.ai === "infusion" ? " Tip: use Look up order & policy." : "")); return; }
    if (text.trim().length < 40) { sendError("Your reply is too short. Please write a full reply."); return; }
    if (cond.ai === "infusion") {
      var missing = INF_TOOLS.filter(function (t) { return !s.used[t]; });
      if (missing.length) {
        openModal("You have not used all 5 AI tools yet",
          '<p class="lead">You used ' + (5 - missing.length) + " of 5 tools for this email. In Full mode, Dana asked you to use all five tools for every email.</p><p>Not used yet: " +
          missing.map(function (t) { return '<span class="chip chip-ai">' + TOOLS[t].label + "</span>"; }).join(" ") + "</p>",
          [{ label: "Send anyway", cls: "btn-ghost btn-lg", fn: function () { closeModal(); doSend(); } },
           { label: "Use the missing tools", cls: "btn-ai btn-lg", fn: function () { closeModal(); var b = $("tool-" + missing[0]); if (b) b.focus(); } }], true);
        return;
      }
    }
    doSend();
  }
  function doSend() {
    $("btn-send").disabled = true; $("reply").readOnly = true;
    sentCount++;
    toast('<span class="tick">✓</span> Sent to ' + esc(EMAILS[current].name));
    setTimeout(function () {
      if (current + 1 < EMAILS.length) { current++; openEmail(current); }
      else { current = EMAILS.length; finish(); }
    }, 1300);
  }
  function toast(html) { var t = $("toast"); t.innerHTML = html; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(function () { t.hidden = true; }, 1800); }

  // ---------- notifications ----------
  function scheduleNotif(ms) { clearTimeout(notifTimer); notifTimer = setTimeout(showNotif, ms); }
  function showNotif() {
    if (!sessionRunning) return;
    if (!$("modal-shade").hidden || busy) { scheduleNotif(2500); return; }
    var n = NOTIFS[notifIndex % NOTIFS.length];
    notifIndex++; notifCount++;
    renderStatus();
    $("notif-app").textContent = n.app;
    $("notif-app-icon").innerHTML = ICON[n.kind];
    $("notif-app-icon").style.background = APP_COLORS[n.kind];
    var av = $("notif-avatar");
    if (n.initials) { av.className = "notif-avatar"; av.textContent = n.initials; av.style.background = n.color; }
    else { av.className = "notif-avatar square"; av.innerHTML = ICON[n.kind]; av.style.background = APP_COLORS[n.kind]; }
    $("notif-title").textContent = n.who;
    $("notif-body").textContent = n.text;
    var acts = $("notif-actions");
    acts.innerHTML = "";
    if (n.replies) {
      $("notif-body").innerHTML = esc(n.text) + '<div class="notif-q" style="margin:6px 0 0">Choose a quick reply:</div>';
      n.replies.forEach(function (r, i) {
        var b = document.createElement("button");
        b.className = "btn " + (i === 0 ? "btn-primary" : "btn-ghost");
        b.textContent = r;
        b.addEventListener("click", function () { closeNotif(); toast('<span class="tick">✓</span> Reply sent to ' + esc(n.who)); });
        acts.appendChild(b);
      });
    } else {
      var d = document.createElement("button");
      d.className = "btn btn-ghost"; d.textContent = "Dismiss";
      d.addEventListener("click", closeNotif);
      acts.appendChild(d);
    }
    $("notif-shade").hidden = false;
    var box = $("notif"); box.hidden = false; box.style.animation = "none"; void box.offsetWidth; box.style.animation = "";
    chime();
    acts.firstChild.focus();
  }
  function closeNotif() {
    $("notif").hidden = true; $("notif-shade").hidden = true;
    if ($("reply")) $("reply").focus({ preventScroll: true });
    scheduleNotif(rand(35000, 50000));
  }
  function chime() {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === "suspended") audioCtx.resume();
      var t0 = audioCtx.currentTime;
      [[784, 0], [1175, 0.14]].forEach(function (p) {
        var o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.value = p[0];
        g.gain.setValueAtTime(0.0001, t0 + p[1]);
        g.gain.exponentialRampToValueAtTime(0.25, t0 + p[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + p[1] + 0.4);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(t0 + p[1]); o.stop(t0 + p[1] + 0.45);
      });
    } catch (e) { /* sound is optional */ }
  }

  // ---------- modal ----------
  function openModal(title, bodyHTML, actions, small) {
    $("modal-title").textContent = title;
    $("modal-body").innerHTML = bodyHTML;
    var box = $("modal-actions"); box.innerHTML = "";
    actions.forEach(function (a) { var b = document.createElement("button"); b.className = "btn " + a.cls; b.textContent = a.label; b.addEventListener("click", a.fn); box.appendChild(b); });
    document.querySelector(".modal").classList.toggle("small-modal", !!small);
    $("modal-shade").hidden = false;
    box.lastChild.focus();
  }
  function closeModal() { $("modal-shade").hidden = true; }

  // ---------- finish ----------
  function finish() {
    sessionRunning = false;
    clearTimeout(notifTimer); clearInterval(focusTimer);
    $("notif").hidden = true; $("notif-shade").hidden = true;
    window.removeEventListener("beforeunload", warnLeave);
    store("bw-done-" + key, "1");
    var code = codeOf(cond);
    $("done-code").textContent = code;
    $("btn-copy").onclick = function () {
      var btn = this;
      function ok() { btn.textContent = "Copied ✓"; setTimeout(function () { btn.textContent = "Copy code"; }, 2000); }
      function fallback() {
        var r = document.createRange(); r.selectNodeContents($("done-code"));
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        try { document.execCommand("copy"); ok(); } catch (e) { btn.textContent = "Select and copy the code"; }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(ok, fallback); else fallback();
    };
    show("screen-done");
  }
})();
