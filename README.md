# Brightway Mail: work-session simulation

Website simulation for a 2 x 2 online experiment (Type of AI use x Work interruptions).
Participants reply to 3 customer emails in a fictional mail app with an AI assistant.
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

Every participant first sees a message from the team lead (Dana Brooks) that explains the day's setup, followed by a "Your setup today" summary whose wording matches the manipulation-check answers in the survey.

- **Routine use (Standard mode):** the AI assistant has one function, Draft reply, presented as the team's standard routine. For every email: Draft reply, fill in the [brackets] from the Order details box, Send.
- **Infusion use (Full mode):** the AI assistant has five tools (Summarize email, Look up order & policy, Draft reply, Improve tone, Check my reply). Participants are asked to use all five for every email; sending with unused tools shows a reminder (they may still send).
- **Notifications:** first pop-up 12 seconds after start, then one 35 to 50 seconds after the previous one is closed. Pop-ups dim the screen, play a chime, and must be handled; chat messages need a quick reply (two buttons), others are dismissed.
- **Focus mode:** no pop-ups; the top bar shows "Focus mode on" with a running focus-session timer.

In both AI conditions the participant must use Draft reply and fill every [bracket] before Send works.

## Files

- `index.html`: page structure
- `style.css`: styles
- `app.js`: conditions, emails, AI assistant, notifications, completion codes
