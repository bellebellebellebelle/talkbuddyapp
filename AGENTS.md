<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep state-driven full-screen assistant visuals in `AuraMotion`, independent of recording and Odoo logic, so visual changes cannot alter voice actions.
- Aura drives the IDEALAB lab by returning a lab page path that the Aura screen shows in a same-origin iframe; app actions run server-side through the registry in src/lib/assistant-apps.server.ts, so new apps only add registry actions.
- Lab apps share Aura's single Odoo connection row (column `db`, aliased to `db_name` in lab code) so users enter Odoo credentials once.
- Lab styles are scoped under `.lab-theme` so they never restyle Aura's screen.
