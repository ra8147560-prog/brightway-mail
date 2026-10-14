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

- **Routine use (Standard mode):** the AI assistant has one fixed function, Draft reply. The participant uses it the same way for each email, fills in the [brackets] from the Order details box, and sends.
- **Infusion use (Full mode):** the AI assistant has five tools (Summarize email, Draft reply, Fill in details, Make it friendlier, Check my reply). Participants are told to use all five for every email; trying to send with unused tools shows a reminder (they may still send).
- **Notifications:** the first pop-up appears 15 seconds after start, then one every 40 to 60 seconds after the previous one is dismissed. Each pop-up dims the screen, plays a chime, and must be dismissed.
- **Focus mode:** no pop-ups; the app shows "Focus mode on".

In both AI conditions the participant must use Draft reply and fill every [bracket] before Send works.

## Files

- `index.html`: page structure
- `style.css`: styles
- `app.js`: conditions, emails, AI assistant, notifications, completion codes
