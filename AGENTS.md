# Silverstoned agent instructions

Silverstoned is a planned black-and-white landing page for a silver accessories business. Aim for the craft of an Awwwards-caliber site through original art direction, clear product storytelling, and well-tested interaction.

## Project documents

| File | When to use it |
| --- | --- |
| [project overview.md](docs/project%20overview.md) | Confirm the project scope, planned stack, and open business decisions. |
| [design.md](docs/design.md) | Follow the visual, content, interaction, and accessibility rules for any frontend work. |
| [logs.md](docs/logs/logs.md) | Read the most recent entries before starting and append one entry before replying to each project prompt. |
| [template.md](docs/templates/template.md) | Copy this entry format whenever you update the log. |

## Working on the project

1. Read the relevant project documents and inspect the files the prompt touches. Confirm what exists in the repository before naming commands, components, routes, or dependencies.
2. For visual work, use the installed frontend-design and build-awwwards-quality-sites skills when available. Follow the project's chosen stack and Lucide icon system. Use the relevant React and GSAP skills when implementing animation.
3. Keep page content and metadata server-rendered where practical. Use client components for browser-dependent interaction. Keep the page navigable by keyboard and make the collection and primary action usable with native scrolling and reduced motion.
4. Use verified product details and brand-owned or licensed imagery for launch. Keep draft copy and imagery identifiable during development. Update the relevant project document when a prompt changes an established decision.
5. Run the checks supported by the repository and the change. Once the app exists, use its package scripts for build, lint, or type checks as applicable. For visual changes, check representative mobile and desktop layouts, keyboard focus, and reduced-motion behavior. In the log, record the checks you actually ran and any relevant checks you could not run.

## Log every project prompt

- Append one entry per user prompt concerning this project, including inspections, questions, documentation changes, and blocked work. Internal tool calls and retries belong in the same entry.
- Copy the fields and order from [template.md](docs/templates/template.md). Use the user's local date in `MM/DD/YYYY` format. Use Asia/Manila when no other project timezone is supplied.
- Append at the end of [logs.md](docs/logs/logs.md) so the latest entries are last. Preserve existing entries unless their correction is part of the request. Record repo-relative paths and check the final log entry before replying.
- Summarize the prompt in your own words. Keep credentials, tokens, and private customer data out of the log. If a user instruction or permission prevents the log write, mention that in your reply.
