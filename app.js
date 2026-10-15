/* Sunny Mail: work-session simulation for a 2 x 2 online experiment.
 * Factor 1, Type of AI use (Saga & Zmud 1994; Sundaram et al. 2007; Hu et al. 2023)
 *   routine  = Standard mode: one AI function (Draft reply) used as a fixed, standardized step in the team routine.
 *   infusion = Full mode: five AI tools used to their fullest potential:
 *              extended (all tools), integrative (lookup and answers flow into the draft),
 *              emergent (Ask Sunny Assist questions to find new ways to help each customer; tools in any order).
 * Factor 2, Work interruptions: on = Open hours (pop-ups must be closed), off = Focus hours (all paused).
 * Condition is read from the URL: index.html?s=<key>. Nothing is recorded or sent anywhere.
 */
(function () {
  "use strict";

  var CONDITIONS = {
    k7p2: { id: 1, ai: "routine",  notif: "on",  c: "TTJINVhS" },
    m4x8: { id: 2, ai: "routine",  notif: "off", c: "RDNUOFFM" },
    t9b6: { id: 3, ai: "infusion", notif: "on",  c: "UDlDNk5a" },
    h3v5: { id: 4, ai: "infusion", notif: "off", c: "SzdXMlZH" }
  };
  function codeOf(cond) { return atob(cond.c).split("").reverse().join(""); }

  // ---------- content ----------
  var SIGN = "Best regards,\nSunny Nest Support";
  var EMAILS = [
    {
      first: "Maria", name: "Maria Lopez", initials: "ML", color: "#E07A1F",
      addr: "maria.lopez@mailbox.com", time: "8:41 AM",
      subject: "Where is my order?", preview: "I ordered a blue table lamp on October 2, and it still has not arrived...",
      goal: "Tell Maria when her late order will arrive",
      body: "Hi,\n\nI ordered a blue table lamp on October 2, and it still has not arrived. The website said it would take 5 days.\n\nCan you tell me when I will get it?\n\nThanks,\nMaria",
      facts: [["Order number", "SN-20417"], ["Item", "Blue table lamp"], ["Status", "Delayed at our warehouse"], ["New delivery date", "October 18"]],
      policy: "Delayed orders: give the new delivery date and say sorry. Orders more than 5 days late can get a 10% discount code (SORRY10).",
      template: "Hi [customer name],\n\nThank you for your email. I checked your order [order number]. It was delayed at our warehouse. Your new delivery date is [new delivery date].\n\nWe are sorry for the wait.\n\n{{extra}}" + SIGN,
      fill: { "[customer name]": "Maria", "[order number]": "SN-20417", "[new delivery date]": "October 18" },
      summary: ["Maria's lamp has not arrived.", "She wants to know when it will arrive.", "Her order is more than a week late."],
      asks: [
        { q: "Can we offer Maria something for the delay?", a: "Yes. Her order is more than 5 days late, so our policy allows a 10% discount code: <b>SORRY10</b>. I added it to your reply.", add: "As a thank-you for your patience, here is a 10% discount code for your next order: SORRY10." },
        { q: "When will Maria get tracking information?", a: "Our warehouse emails a tracking link as soon as the lamp ships. I added this to your reply.", add: "You will get a tracking link by email as soon as your lamp ships." },
        { q: "How can I make the apology sound sincere?", a: "Say what you are doing about the problem. I added a line that you are keeping an eye on her order.", add: "I am personally keeping an eye on your order to make sure it arrives on time." }
      ]
    },
    {
      first: "James", name: "James Carter", initials: "JC", color: "#0E9F8F",
      addr: "j.carter@inbox.net", time: "8:47 AM",
      subject: "My vase arrived broken", preview: "My ceramic vase arrived today, but it is broken into pieces...",
      goal: "Tell James how we will fix his broken order",
      body: "Hello,\n\nMy ceramic vase arrived today, but it is broken into pieces. I am very disappointed.\n\nWhat can you do about this?\n\nJames",
      facts: [["Order number", "SN-19882"], ["Item", "Ceramic vase"], ["Problem", "Arrived broken"], ["What we do", "Full refund, no need to send it back"], ["Refund time", "3 to 5 business days"]],
      policy: "Broken items: full refund, no need to send the item back. If the item is in stock, the customer can choose a free replacement instead.",
      template: "Hi [customer name],\n\nThank you for letting us know. I am sorry that your item from order [order number] arrived broken. We will give you a full refund. You will get your money back in [refund time].\n\nYou do not need to send the item back.\n\n{{extra}}" + SIGN,
      fill: { "[customer name]": "James", "[order number]": "SN-19882", "[refund time]": "3 to 5 business days" },
      summary: ["James's vase arrived broken.", "He is disappointed.", "He asks what we can do."],
      asks: [
        { q: "Can we send James a new vase instead?", a: "Yes. The ceramic vase is in stock, so James can choose a free replacement instead of a refund. I added this option to your reply.", add: "If you prefer, we can send you a new vase for free instead. It would ship within 2 days. Just reply to this email to let me know." },
        { q: "Do we need a photo of the broken vase?", a: "No. For items under $100 we do not ask for a photo. I added this to your reply so James does not worry.", add: "You do not need to send us a photo." },
        { q: "How can we stop this from happening again?", a: "The warehouse now uses extra padding for glass and ceramic items. I added a line about it.", add: "We have also asked our warehouse to use extra padding for ceramic items." }
      ]
    },
    {
      first: "Priya", name: "Priya Shah", initials: "PS", color: "#8B5CF6",
      addr: "priya.shah@webmail.com", time: "8:55 AM",
      subject: "New address + a birthday gift", preview: "I just moved. Can you please send my order to my new address? Also...",
      goal: "Answer all of Priya's questions",
      body: "Hi there,\n\nI just moved. Can you please send my order to my new address?\n\n88 Pine Street, Denver, CO 80203\n\nAlso, the towels are a birthday gift for my mom. Her birthday is on October 20. Will they arrive in time? And can you add a note: \"Happy birthday, Mom! Love, Priya\"\n\nThank you!\nPriya",
      facts: [["Order number", "SN-21056"], ["Item", "Kitchen towel set (gift)"], ["Status", "Not shipped yet, so the address can change"], ["New address", "88 Pine Street, Denver, CO 80203"], ["Standard delivery", "Arrives October 22"], ["Express delivery", "Arrives October 18, free for gift orders"], ["Gift note", "Free, can be added"]],
      policy: "Address changes: allowed before the order ships. Gift orders: free express delivery and free gift notes.",
      template: "Hi [customer name],\n\nThank you for your message. Your order [order number] has not shipped yet, so I changed the delivery address to [new address].\n\n[answer: will it arrive before October 20?]\n\n[answer: the gift note]\n\nYou will get a tracking email when it ships.\n\n{{extra}}" + SIGN,
      fill: { "[customer name]": "Priya", "[order number]": "SN-21056", "[new address]": "88 Pine Street, Denver, CO 80203" },
      summary: ["Priya moved and wants a new delivery address.", "The order is a birthday gift for her mom (birthday: October 20).", "She asks if it will arrive in time, and she wants a gift note."],
      asks: [
        { q: "Can the gift arrive before October 20?", a: "Standard delivery arrives October 22, which is too late. Gift orders get free express delivery, which arrives <b>October 18</b>. I upgraded the order and added this to your reply.", fill: { "[answer: will it arrive before October 20?]": "Good news: I upgraded your order to free express delivery, so it will arrive on October 18, before your mom's birthday." } },
        { q: "Can we add Priya's gift note?", a: "Yes, gift notes are free. I added her note to the order and to your reply.", fill: { "[answer: the gift note]": "I also added your gift note: \"Happy birthday, Mom! Love, Priya\"." } },
        { q: "Suggest a warm closing for a birthday gift.", a: "Here is a friendly line. I added it to your reply.", add: "I hope your mom has a wonderful birthday!" }
      ]
    }
  ];
  var OLD_MAIL = [
    { name: "Dana Brooks", initials: "DB", color: "#D6336C", time: "8:52 AM", subject: "Today's work", preview: "Hi! Please answer the 3 customer emails in our inbox today..." },
    { name: "Team Calendar", initials: "TC", color: "#C2410C", time: "8:30 AM", subject: "Today 9:00 to 10:00", preview: "Your team calendar for today is ready." },
    { name: "IT Help Desk", initials: "IT", color: "#475569", time: "Yesterday", subject: "Sunny Assist is in your mailbox", preview: "The AI assistant now appears on the right side of Sunny Mail..." }
  ];

  // Notifications: from coworkers and systems (not from the team lead). Positions vary.
  var NOTIFS = [
    { app: "Chat", kind: "chat", pos: "br", who: "Sam Rivera", initials: "SR", color: "#0E7490", text: "Do you know where the holiday schedule file is?", replies: ["In the team folder", "Not sure, sorry"] },
    { app: "Calendar", kind: "cal", pos: "center", who: "Reminder: Team huddle", text: "Starts in 10 minutes, Room 2B and online.", buttons: ["Dismiss", "Snooze 5 min"] },
    { app: "Mail", kind: "mail", pos: "tr", who: "IT Help Desk", text: "Your password expires in 3 days. Please update it soon.", buttons: ["Dismiss"] },
    { app: "Chat", kind: "chat", pos: "bl", who: "Alex Kim", initials: "AK", color: "#9333EA", text: "Are you joining the team lunch on Friday?", replies: ["Yes!", "Can't this week"] },
    { app: "System", kind: "sys", pos: "tc", who: "Updates are ready", text: "Restart your computer to finish installing updates.", buttons: ["Later"] },
    { app: "Chat", kind: "chat", pos: "tr", who: "Jordan Lee", initials: "JL", color: "#2563EB", text: "Can you cover the help line for 10 minutes at 2 PM?", replies: ["Sure", "Sorry, I can't"] },
    { app: "Mail", kind: "mail", pos: "br", who: "HR Team", text: "Benefits sign-up closes on Friday. Don't forget!", buttons: ["Dismiss"] },
    { app: "Calendar", kind: "cal", pos: "center", who: "Reminder: Training", text: "\"New return policy\" starts in 15 minutes.", buttons: ["Dismiss", "Snooze 5 min"] },
    { app: "Chat", kind: "chat", pos: "bl", who: "Mia Chen", initials: "MC", color: "#DB2777", text: "Did a customer named Tom call this morning?", replies: ["Not yet", "I'm not sure"] },
    { app: "Files", kind: "sys", pos: "tc", who: "Shared drive", text: "Sam Rivera edited \"October shifts.xlsx\".", buttons: ["Dismiss"] },
    { app: "Chat", kind: "chat", pos: "br", who: "Sam Rivera", initials: "SR", color: "#0E7490", text: "Thanks! Also, do you have the printer code?", replies: ["It's 4521", "Ask IT, sorry"] },
    { app: "Mail", kind: "mail", pos: "tl", who: "Facilities", text: "The coffee machine on floor 2 is being fixed today.", buttons: ["Dismiss"] }
  ];

  var TOOLS = {
    summarize: { short: "Summarize", label: "Summarize email", hint: "See what the customer needs", icon: '<path d="M5 6h14M5 10h14M5 14h9M5 18h6"/>' },
    lookup:    { short: "Look up", label: "Look up order & policy", hint: "Get the facts and the rules", icon: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>' },
    ask:       { short: "Ask", label: "Ask Sunny Assist", hint: "Ask questions to help the customer more", icon: '<path d="M4.5 5.5h15v10h-9l-4 3.5v-3.5h-2z"/><path d="M10 9.2a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6.9v.3"/>' },
    draft:     { short: "Draft", label: "Draft reply", hint: "Write a reply with everything you found", icon: '<path d="M4 20h4L19 9l-4-4L4 16z"/>' },
    polish:    { short: "Check & polish", label: "Check & polish", hint: "Improve the tone and catch mistakes", icon: '<path d="M5 12.5 9.5 17 19 7.5"/>' }
  };
  var INF_TOOLS = ["summarize", "lookup", "ask", "draft", "polish"];

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
  var APP_COLORS = { chat: "#5B5FC7", mail: "#0B8A84", cal: "#C2410C", sys: "#475569" };

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function show(id) { ["screen-error", "screen-intro", "screen-work", "screen-done"].forEach(function (s) { $(s).hidden = s !== id; }); window.scrollTo(0, 0); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function store(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function toolIcon(t) { return '<svg viewBox="0 0 24 24" class="ic">' + TOOLS[t].icon + "</svg>"; }

  // ---------- state ----------
  var params = new URLSearchParams(location.search);
  var key = (params.get("s") || "").toLowerCase();
  var cond = CONDITIONS[key];
  var current = 0;
  var states = EMAILS.map(function () { return { used: {}, asked: {}, drafted: false, read: false }; });
  var busy = false, sentCount = 0;
  var notifTimer = null, notifIndex = 0, notifCount = 0, tickTimer = null, startTime = 0;
  var audioCtx = null, sessionRunning = false;

  if (!cond) { show("screen-error"); return; }
  if (store("bw-done-" + key) === "1") { finish(); return; }

  // ---------- setup cards + Dana's message ----------
  function setupHTML() {
    var ai = cond.ai === "routine"
      ? '<div class="setup-card sc-ai"><span class="sc-icon">' + SPARK + '</span><div><div class="sc-label">AI assistant (Sunny Assist)</div>' +
        '<div class="sc-value">Standard mode</div><div class="sc-sub">One AI function: Draft reply</div>' +
        '<p>Use it as a fixed step in our team routine, the same way for every email: <span class="flow"><span class="chip chip-ai">Draft reply</span> → fill in the [brackets] → <span class="chip">Send</span></span></p></div></div>'
      : '<div class="setup-card sc-ai"><span class="sc-icon">' + SPARK + '</span><div><div class="sc-label">AI assistant (Sunny Assist)</div>' +
        '<div class="sc-value">Full mode</div><div class="sc-sub">Five AI tools</div>' +
        '<p>Get the most out of the AI: use all five tools for every email, in any order, and ask Sunny Assist questions to help each customer more.</p></div></div>';
    var nt = cond.notif === "on"
      ? '<div class="setup-card sc-on"><span class="sc-icon">' + ICON.bell + '</span><div><div class="sc-label">Notifications</div>' +
        '<div class="sc-value">Notifications ON</div><div class="sc-sub">Pop-up messages will appear</div>' +
        '<p>Chat messages, emails and reminders will pop up while you work. Close each one to keep working. Please turn your sound on.</p>' +
        '<span class="cal">' + ICON.cal + 'Team calendar: 9:00–10:00 Open hours</span></div></div>'
      : '<div class="setup-card sc-off"><span class="sc-icon">' + ICON.moon + '</span><div><div class="sc-label">Notifications</div>' +
        '<div class="sc-value">Focus mode ON</div><div class="sc-sub">No pop-up messages</div>' +
        '<p>All notifications are paused. Nothing will pop up while you work.</p>' +
        '<span class="cal">' + ICON.cal + 'Team calendar: 9:00–10:00 Focus hours</span></div></div>';
    return ai + nt;
  }
  function leadMessageHTML() {
    var h = "<p>Hi! Please answer the 3 customer emails in our inbox this morning.</p>";
    if (cond.ai === "routine") {
      h += "<p><b>Sunny Assist is in Standard mode.</b> It has one function, <span class=\"chip chip-ai\">Draft reply</span>, and it is a fixed step in our team routine. Please handle every email the same way: click Draft reply, fill in the parts in [brackets] yourself, then send. If a customer asks something extra, write that answer yourself in the [brackets].</p>";
    } else {
      h += "<p><b>Sunny Assist is in Full mode</b> with five AI tools: " +
        INF_TOOLS.map(function (t) { return '<span class="chip chip-ai">' + TOOLS[t].label + "</span>"; }).join(" ") +
        ". Please get the most out of it: use all five tools for every email, in any order you like. Ask Sunny Assist questions to find the best way to help each customer.</p>";
    }
    h += cond.notif === "on"
      ? "<p>9:00 to 10:00 is <b>Open hours</b> on our team calendar, so <b>notifications are on</b>: chat messages, emails and reminders will pop up while you work.</p>"
      : "<p>9:00 to 10:00 is <b>Focus hours</b> on our team calendar, so Sunny Mail <b>pauses all notifications</b> (Focus mode). Nothing will pop up while you work.</p>";
    return h + "<p>Thanks!<br>Dana</p>";
  }

  $("setup-grid").innerHTML = setupHTML();
  $("lead-msg-body").innerHTML = leadMessageHTML();
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
    tickTimer = setInterval(renderStatus, 1000);
    if (cond.notif === "on") scheduleNotif(8000);
    window.addEventListener("beforeunload", warnLeave);
  }
  function warnLeave(e) { if (sessionRunning) { e.preventDefault(); e.returnValue = ""; } }

  // ---------- chrome ----------
  function setupChrome() {
    $("status-ai").innerHTML = '<svg viewBox="0 0 24 24" class="ic" style="fill:currentColor;stroke:none"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z"/></svg>AI: ' + (cond.ai === "routine" ? "Standard mode" : "Full mode");
    var fs = $("folder-status");
    fs.className = "folder-status " + cond.notif;
    fs.innerHTML = cond.notif === "on"
      ? ICON.bell + "<span>Notifications on<br><span class='fs-sub'>Open hours 9:00–10:00</span></span>"
      : ICON.moon + "<span>Focus mode on<br><span class='fs-sub'>Focus hours 9:00–10:00</span></span>";
    $("ai-mode").textContent = cond.ai === "routine" ? "Standard mode: Draft reply" : "Full mode: 5 tools";
    $("btn-guide").addEventListener("click", openGuide);
    renderStatus();
  }
  function renderStatus() {
    var sec = Math.floor((Date.now() - startTime) / 1000);
    var min = Math.floor(sec / 60);
    $("rb-clock").textContent = "9:" + String(Math.min(59, min)).padStart(2, "0") + " AM";
    var p = $("status-notif");
    if (cond.notif === "on") {
      p.className = "status on";
      p.innerHTML = ICON.bell + "Notifications on" + (notifCount ? ' <span class="badge">' + notifCount + "</span>" : "");
    } else {
      p.className = "status off";
      p.innerHTML = ICON.moon + "Focus mode on <span class=\"timer\">" + String(min).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0") + "</span>";
    }
  }
  function openGuide() {
    openModal("My setup today",
      '<div class="setup-grid">' + setupHTML() + '</div><article class="lead-msg"><div class="lead-msg-head"><span class="avatar" style="background:#D6336C">DB</span><div><div class="who">Dana Brooks <span class="role">Team Lead</span></div><div class="muted small">8:52 AM</div></div></div><div class="lead-msg-body">' + leadMessageHTML() + "</div></article>",
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
    $("steps-label").textContent = cond.ai === "routine" ? "Standard routine:" : "All 5 AI tools, any order:";
    $("reader").innerHTML =
      '<h1 class="mail-subject">' + esc(m.subject) + "</h1>" +
      '<div class="mail-head"><span class="avatar" style="background:' + m.color + '">' + m.initials + "</span>" +
      '<div><div class="who">' + esc(m.name) + '</div><div class="addr">&lt;' + esc(m.addr) + "&gt; to Sunny Nest Support</div></div>" +
      '<span class="when">Today, ' + m.time + "</span></div>" +
      '<div class="mail-body">' + esc(m.body) + "</div>" +
      '<div class="facts" id="facts"><h3>' + ICON.note + 'Order details <span class="src">from the order system</span></h3><dl>' +
      m.facts.map(function (f) { return "<dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd>"; }).join("") + "</dl></div>" +
      '<div class="composer" id="composer">' +
      '<div class="composer-head"><span class="to">To</span><span class="to-chip">' + esc(m.name) + "</span></div>" +
      '<div class="composer-sub">RE: ' + esc(m.subject) + "</div>" +
      '<textarea id="reply" aria-label="Your reply to ' + esc(m.first) + '" placeholder="' +
      (cond.ai === "routine" ? "Follow the standard routine: click Draft reply in Sunny Assist." : "Use the Sunny Assist tools to write your reply.") + '"></textarea>' +
      '<div class="composer-foot"><div class="blanks" id="blanks"></div>' +
      '<button class="btn btn-primary btn-lg" id="btn-send"><svg viewBox="0 0 24 24" class="ic"><path d="m4 12 16-7-6 15-2.5-5.5z"/></svg>Send</button></div></div>' +
      '<div class="composer-error" id="send-error" role="alert" hidden></div>';
    $("reader").scrollTop = 0;
    $("reply").addEventListener("input", function () { $("send-error").hidden = true; refresh(); });
    $("btn-send").addEventListener("click", trySend);
    $("ai-log").innerHTML = "";
    if (cond.ai === "routine") {
      addBubble("New email from " + esc(m.first) + ". Standard routine: click <strong>Draft reply</strong> and I will write the standard draft. You fill in the [brackets].");
    } else {
      addBubble("New email from " + esc(m.first) + ". In Full mode you can use my five tools in any order." + (i === 2 ? " " + esc(m.first) + " asks several things, so try asking me about them." : " Not sure where to start? Try <strong>Summarize email</strong>."));
    }
    renderTools();
    refresh();
  }
  function blanksIn(text) { return text.match(/\[[^\]]*\]/g) || []; }

  // ---------- steps & tools ----------
  function refresh() {
    var s = states[current], text = $("reply").value, b = blanksIn(text);
    var stepsEl = $("steps");
    if (cond.ai === "routine") {
      var filled = s.drafted && b.length === 0;
      var steps = [{ label: "Draft reply", done: s.drafted }, { label: "Fill in [brackets]", done: filled }, { label: "Send", done: false }];
      var nextIdx = steps.findIndex(function (x) { return !x.done; });
      stepsEl.className = "steps";
      stepsEl.innerHTML = steps.map(function (x, i) { return '<li data-n="' + (i + 1) + '" class="' + (x.done ? "done" : i === nextIdx ? "next" : "") + '">' + esc(x.label) + "</li>"; }).join("");
      $("tool-draft").classList.toggle("next", !s.drafted);
      $("tool-draft").disabled = busy;
      var step = !s.drafted ? 0 : b.length ? 1 : 2;
      [].forEach.call($("routine-ol").children, function (li, i) { li.className = i === step ? "cur" : ""; });
    } else {
      stepsEl.className = "steps free";
      stepsEl.innerHTML = INF_TOOLS.map(function (t) { return '<li class="' + (s.used[t] ? "done" : "") + '">' + esc(TOOLS[t].short) + "</li>"; }).join("") + "<li>Send</li>";
      var n = 0;
      INF_TOOLS.forEach(function (t) {
        var btn = $("tool-" + t), used = !!s.used[t];
        if (used) n++;
        btn.classList.toggle("used", used);
        btn.querySelector(".used-tag").textContent = used ? "Used" : "";
        btn.disabled = busy;
      });
      $("tools-used").textContent = "AI tools used: " + n + " of 5";
      $("tools-meter").style.width = (n / 5 * 100) + "%";
      [].forEach.call(document.querySelectorAll(".ask-chip"), function (c) { c.disabled = busy || !!s.asked[c.dataset.i] || c.dataset.e !== String(current); });
    }
    var el = $("blanks");
    if (!s.drafted && !text.trim()) el.innerHTML = '<span class="muted">' + (cond.ai === "routine" ? "Start with Draft reply." : "Use the AI tools to write your reply.") + "</span>";
    else if (b.length) el.innerHTML = "<span>Fill in:</span>" + b.map(function (x) { return '<span class="blank-chip">' + esc(x) + "</span>"; }).join("");
    else el.innerHTML = '<span class="ok">✓ All parts filled in</span>';
  }
  function renderTools() {
    var box = $("ai-tools");
    if (cond.ai === "routine") {
      box.innerHTML = '<div class="routine-box"><b>Standard mode</b>: our fixed routine for every email<ol id="routine-ol"><li>Draft reply (AI)</li><li>Fill in the [brackets] yourself</li><li>Send</li></ol></div>' +
        '<button class="btn btn-ai btn-draft-big" id="tool-draft"><svg viewBox="0 0 24 24" class="ic" style="fill:#fff;stroke:none"><path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5z"/></svg>Draft reply</button>';
      $("tool-draft").addEventListener("click", function () { runTool("draft"); });
      return;
    }
    box.innerHTML = '<p class="tools-note"><b>Full mode</b>: use all 5 tools for every email, in any order.</p><ul class="tool-list">' +
      INF_TOOLS.map(function (t) { return '<li><button class="tool-btn" id="tool-' + t + '"><span class="ti">' + toolIcon(t) + "</span><span>" + TOOLS[t].label + "<small>" + TOOLS[t].hint + '</small></span><span class="used-tag"></span></button></li>'; }).join("") +
      '</ul><div class="tools-count"><span id="tools-used">AI tools used: 0 of 5</span><div class="meter"><span id="tools-meter" style="width:0"></span></div></div>';
    INF_TOOLS.forEach(function (t) { $("tool-" + t).addEventListener("click", function () { runTool(t); }); });
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
  function think(label, fn) {
    if (busy) return;
    busy = true;
    var idx = current;
    addBubble(esc(label), "user");
    var typing = addBubble("<i></i><i></i><i></i>", "typing");
    refresh();
    setTimeout(function () {
      typing.remove();
      if (idx !== current) { busy = false; refresh(); return; }
      fn(function () { busy = false; refresh(); });
    }, 850);
  }
  function runTool(t) {
    if (t === "ask") return think(TOOLS.ask.label, function (done) { showAskChips(); done(); });
    think(TOOLS[t].label, function (done) { doTool(t, done); });
  }
  function streamInto(text, done) {
    var ta = $("reply"), i = 0, step = Math.max(6, Math.ceil(text.length / 45));
    var c = $("composer"); c.classList.remove("flash"); void c.offsetWidth; c.classList.add("flash");
    $("send-error").hidden = true;
    (function tick() {
      i = Math.min(text.length, i + step);
      ta.value = text.slice(0, i);
      ta.scrollTop = ta.scrollHeight;
      if (i < text.length) setTimeout(tick, 16); else { ta.scrollTop = 0; done && done(); }
    })();
  }
  function fillFacts(text, m) { Object.keys(m.fill).forEach(function (k) { text = text.split(k).join(m.fill[k]); }); return text; }
  function insertBeforeSign(text, add) {
    var k = text.search(/(Best|Warm) regards,/);
    if (k < 0) return text.replace(/\s*$/, "") + "\n\n" + add;
    return text.slice(0, k) + add + "\n\n" + text.slice(k);
  }
  function buildDraft(m, s) {
    var text = m.template;
    if (cond.ai === "routine") return text.replace("{{extra}}", "");
    if (s.used.lookup) text = fillFacts(text, m);
    var extras = [];
    m.asks.forEach(function (a, i) {
      if (!s.asked[i]) return;
      if (a.fill) Object.keys(a.fill).forEach(function (k) { text = text.split(k).join(a.fill[k]); });
      if (a.add) extras.push(a.add + "\n\n");
    });
    return text.replace("{{extra}}", extras.join(""));
  }

  function showAskChips() {
    var m = EMAILS[current], s = states[current];
    var html = "Here are questions you can ask me about this email. Pick any:<div class=\"ask-chips\">" +
      m.asks.map(function (a, i) { return '<button class="ask-chip" data-e="' + current + '" data-i="' + i + '"' + (s.asked[i] ? " disabled" : "") + '><span>💬</span><span class="q">' + esc(a.q) + "</span></button>"; }).join("") + "</div>";
    var b = addBubble(html);
    [].forEach.call(b.querySelectorAll(".ask-chip"), function (c) {
      c.addEventListener("click", function () { askQuestion(+c.dataset.i); });
    });
  }
  function askQuestion(i) {
    var m = EMAILS[current], s = states[current], a = m.asks[i];
    if (s.asked[i]) return;
    think(a.q, function (done) {
      s.asked[i] = true; s.used.ask = true;
      addBubble(a.a);
      var text = $("reply").value;
      if (text.trim()) {
        var nt = text;
        if (a.fill) Object.keys(a.fill).forEach(function (k) { nt = nt.split(k).join(a.fill[k]); });
        if (a.add && nt.indexOf(a.add) === -1) nt = insertBeforeSign(nt, a.add);
        if (nt !== text) { streamInto(nt, done); return; }
      }
      done();
    });
  }

  function doTool(t, done) {
    var m = EMAILS[current], s = states[current], text = $("reply").value;
    if (t === "summarize") {
      s.used.summarize = true;
      addBubble("<strong>Summary</strong><ul>" + m.summary.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>");
      return done();
    }
    if (t === "lookup") {
      s.used.lookup = true;
      var f = $("facts"); f.classList.add("glow"); setTimeout(function () { f.classList.remove("glow"); }, 1600);
      addBubble("<strong>Order &amp; policy</strong><div class=\"kv\">" + m.facts.map(function (x) { return "<span>" + esc(x[0]) + "</span><b>" + esc(x[1]) + "</b>"; }).join("") +
        "</div><p style=\"margin:.5em 0 0\"><b>Policy:</b> " + esc(m.policy) + "</p>");
      if (text.trim() && blanksIn(text).length) {
        var nt = fillFacts(text, m);
        if (nt !== text) { streamInto(nt, function () { addBubble("I filled in the order facts in your draft."); done(); }); return; }
      }
      return done();
    }
    if (t === "draft") {
      s.used.draft = true; s.drafted = true;
      var d = buildDraft(m, s);
      streamInto(d, function () {
        var left = blanksIn(d).length;
        if (cond.ai === "routine") addBubble("Here is the standard draft. Now <strong>fill in the parts in [brackets]</strong> using the email and the Order details box, then click Send.");
        else if (left) addBubble("I wrote a draft with what I know. Some parts are still in [brackets]." + (s.used.lookup ? "" : " <strong>Look up order &amp; policy</strong> fills in the facts.") + " You can also <strong>ask me</strong> about the customer's questions, or type the answers yourself.");
        else addBubble("I wrote a full reply using everything we found together.");
        done();
      });
      return;
    }
    if (t === "polish") {
      if (!text.trim()) { addBubble("Your reply is empty. Please use <strong>Draft reply</strong> first."); return done(); }
      s.used.polish = true;
      var nt2 = text;
      if (!/Warm regards/.test(nt2)) {
        var warm = "Please let me know if there is anything else I can do for you. Have a wonderful day!";
        nt2 = nt2.indexOf("Best regards,") !== -1 ? nt2.replace("Best regards,", warm + "\n\nWarm regards,") : nt2.replace(/\s*$/, "") + "\n\n" + warm + "\n\nWarm regards,\nSunny Nest Support";
        nt2 = nt2.replace(/^(Hi [^\n]*,)/, "$1\n\nI hope you are doing well.");
      }
      var checks = [
        ["Uses the customer's name", nt2.indexOf(m.first) !== -1],
        ["Has the order number", nt2.indexOf(m.fill["[order number]"]) !== -1],
        ["Answers every question (no [brackets] left)", blanksIn(nt2).length === 0],
        ["Warm, polite tone", true]
      ];
      var ok = checks.every(function (c) { return c[1]; });
      var report = function () {
        addBubble("<strong>I polished the tone and checked your reply</strong><ul>" + checks.map(function (c) { return '<li><span class="' + (c[1] ? "check-yes" : "check-no") + '">' + (c[1] ? "✓" : "✗") + "</span> " + c[0] + "</li>"; }).join("") +
          "</ul>" + (ok ? "Your reply is ready to send." : "Please fix the items marked ✗."));
        done();
      };
      if (nt2 !== text) streamInto(nt2, report); else report();
      return;
    }
    done();
  }

  // ---------- sending ----------
  function sendError(msg) { var e = $("send-error"); e.innerHTML = msg; e.hidden = false; e.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
  function trySend() {
    if (busy) return;
    var s = states[current], text = $("reply").value;
    if (!s.drafted) { sendError(cond.ai === "routine" ? "Follow the standard routine: first click Draft reply in Sunny Assist." : "First use the Sunny Assist tools to write your reply (Draft reply writes it for you)."); return; }
    if (blanksIn(text).length) { sendError("Fill in the parts in [brackets] first. You can find what you need in the customer's email and the Order details box." + (cond.ai === "infusion" ? " Tip: Sunny Assist can help." : "")); return; }
    if (text.trim().length < 40) { sendError("Your reply is too short. Please write a full reply."); return; }
    if (cond.ai === "infusion") {
      var missing = INF_TOOLS.filter(function (t) { return !s.used[t]; });
      if (missing.length) {
        openModal("You have not used all 5 AI tools yet",
          '<p class="lead">You used ' + (5 - missing.length) + " of 5 tools for this email. In Full mode, please get the most out of Sunny Assist by using all five tools.</p><p>Not used yet: " +
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
    if (!$("modal-shade").hidden || busy) { scheduleNotif(2000); return; }
    var n = NOTIFS[notifIndex % NOTIFS.length];
    notifIndex++; notifCount++;
    renderStatus();
    var box = $("notif");
    box.className = "notif pos-" + n.pos;
    $("notif-app").textContent = n.app;
    $("notif-app-icon").innerHTML = ICON[n.kind];
    $("notif-app-icon").style.background = APP_COLORS[n.kind];
    var av = $("notif-avatar");
    if (n.initials) { av.className = "notif-avatar"; av.textContent = n.initials; av.style.background = n.color; }
    else { av.className = "notif-avatar square"; av.innerHTML = ICON[n.kind]; av.style.background = APP_COLORS[n.kind]; }
    $("notif-title").textContent = n.who;
    $("notif-body").innerHTML = esc(n.text) + (n.replies ? '<div class="notif-q">Choose a quick reply:</div>' : "");
    var acts = $("notif-actions");
    acts.innerHTML = "";
    (n.replies || n.buttons).forEach(function (r, i) {
      var b = document.createElement("button");
      b.className = "btn " + (n.replies && i === 0 ? "btn-primary" : "btn-ghost");
      b.textContent = r;
      b.addEventListener("click", function () { closeNotif(); if (n.replies) toast('<span class="tick">✓</span> Reply sent to ' + esc(n.who)); });
      acts.appendChild(b);
    });
    $("notif-shade").hidden = false;
    box.hidden = false;
    box.style.animation = "none"; void box.offsetWidth; box.style.animation = "";
    chime();
    acts.firstChild.focus();
  }
  function closeNotif() {
    $("notif").hidden = true; $("notif-shade").hidden = true;
    if ($("reply")) $("reply").focus({ preventScroll: true });
    scheduleNotif(rand(18000, 28000));
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
    clearTimeout(notifTimer); clearInterval(tickTimer);
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
