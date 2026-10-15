# Sunny Mail: work-session simulation

Website simulation for a 2 x 2 online experiment (Type of AI use x Work interruptions).
Participants reply to 3 customer emails in a fictional mail app (Sunny Mail, store: Sunny Nest) with an AI assistant (Sunny Assist).
The site is static (GitHub Pages) and records nothing; the survey runs on Qualtrics.

## Condition links

Replace `<site>` with the GitHub Pages address of this repository.

| Condition | Type of AI use | Work interruptions | Link | Completion code |
|---|---|---|---|---|
| 1 | Routine use (Standard mode) | Notifications | `<site>/?s=k7p2` | RX5H2M |
| 2 | Routine use (Standard mode) | Focus mode | `<site>/?s=m4x8` | LQ8T3D |
| 3 | Infusion use (Full mode) | Notifications | `<site>/?s=t9b6` | ZN6C9P |
| 4 | Infusion use (Full mode) | Focus mode | `<site>/?s=h3v5` | GV2W7K |

A link without a valid `s` value shows "This link is not complete".

## How the manipulations work

The briefing screen shows a two-line chat message from the team lead, Dana Brooks, and "Your setup today": two cards whose wording matches the survey's manipulation checks. Theme: ocean blue, rounded, Nunito font.

**Type of AI use** (Saga & Zmud 1994; Sundaram et al. 2007; Hu et al. 2023)

- **Routine use (Standard mode):** one AI function, Draft reply, used as a fixed step in the team routine for every email: Draft reply, fill in the [brackets] yourself, Send. Extra customer questions are answered by hand in the brackets.
- **Infusion use (Full mode):** five AI tools used to their fullest potential, in any order: Summarize email, Look up order & policy, Ask Sunny Assist, Draft reply, Check & polish.
  - Extended use: all five tools for every email (sending with unused tools shows a reminder; participants may still send).
  - Integrative use: the lookup and the answers to questions flow into the draft.
  - Emergent use: Ask Sunny Assist offers three questions per email (pre-written answers) that add new ways to help the customer, for example a discount code or a free replacement.
- Email 3 (Priya) is a non-standard case for both conditions: new address, a birthday gift, and a gift note.

**Work interruptions**

- Framed as the team calendar, not as a choice by the team lead: 9:00 to 10:00 is Open hours (notifications on) or Focus hours (Focus mode, notifications paused).
- **Notifications:** first pop-up 8 seconds after the inbox opens, then one 18 to 28 seconds after the previous one is closed. Pop-ups come from coworkers and systems, appear in six positions (corners, top center, center reminder window), dim the screen, play a chime, and must be closed (chat messages need a quick reply).
- **Focus mode:** no pop-ups; the status pill shows a running focus timer.

## Files

- `index.html`: page structure
- `style.css`: styles
- `app.js`: conditions, emails, AI assistant, notifications, completion codes
