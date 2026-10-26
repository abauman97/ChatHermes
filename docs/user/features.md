# Use ChatHermes

## Chats and attachments

Use the drawer to open a saved chat, or **New chat** to start another. Switch profiles to see that profile's conversations. Select the provider and model before sending; selections affect the session runtime.

The model picker also has a **Reasoning effort** select. Choose None, Minimal, Low, Medium, High, XHigh, Max, or Ultra before sending. Explicit choices apply to that chat after its model is selected; they do not change other chats or profile defaults. **Model default** uses the selected model’s configured reasoning setting without adding an explicit override. Hermes controls the model's supported levels and may map a requested level to a supported one or omit reasoning for models that do not support it. Picker choices are held for the current page visit.

Attach files or images with the composer, drag files onto the chat, or use camera capture where supported. Failed uploads can be retried or removed without losing the draft. Uploads are limited to 20 MB decoded per file. Images retain their originals for later viewing. Other files are made available to the agent in the selected profile's filesystem.

Thinking and tool disclosures show the activity Hermes provides. Open a completed disclosure to inspect it. Approvals and clarification requests appear in the conversation; respond there to continue.

## Projects and instructions

Open **Projects** and select a Project to view its recent chats and repository hierarchy. Hermes supplies Projects, including automatic repository Projects and Home.

Use **New Project Chat** to create a distinct chat in the selected Project workspace. In an open chat, **New chat** starts an unscoped chat; on Project home it retains scoped creation. Home starts without a Project workspace. A Project without an available workspace cannot start a chat.

Browsing another Project changes the view while retaining the current chat's workspace. Resuming an existing chat always uses its saved workspace. Manage Projects and move sessions through Hermes Desktop/CLI.

Use the Project instructions editor to load and save the workspace instruction file. It edits the first existing supported instruction file, or creates `.hermes.md` when none exists. It does not edit inherited instructions in parent directories. If the file changes elsewhere, reload and reconcile your draft before saving. Hermes loads instructions through its normal context loader.

## Artifacts

Open a file card in a conversation, or browse **Artifacts** globally or within a Project. Images have thumbnails and a larger viewer; PDFs and supported media use browser viewers. Text, HTML, and SVG display as escaped source; other files offer download.

The library shows its first 50 indexed files immediately. Use **Load More** for
older files and **Refresh** to read the latest index. Existing conversations are
indexed in the background; newly delivered files may take a moment to appear.

Artifacts come from explicit delivered-file references and uploads in saved history. A bare path or ordinary link does not create an artifact. Preview and download use the authenticated dashboard and the chat's profile/workspace. Confirm deletion only when you intend to remove the actual managed file. Historical references remain afterward; remote SSH deletion is unsupported.

## Scheduled results

Open **Scheduled** in the drawer and select Active, Paused, or Completed. Select a job, then a dated run to read the full output. Runs appear newest first; load older pages as needed. Agent transcripts retain thinking/tool disclosures, and script-only saved Markdown is readable.

**Open a chat about this run** creates a separate normal chat and drafts the job, date, and saved output for review before sending. Create, schedule, pause, or modify jobs in Hermes's native dashboard. Deleted jobs and pruned output cannot be recovered.

To receive Cron notifications, [configure ChatHermes delivery](notifications.md#enable-cron-delivery).

## Share and reopen links

Use the current page URL to reopen a chat, Project, or scheduled run under dashboard authentication. Canonical links use a hash, such as `/chathermes?profile=default#/chat/session_123?profile=default`. Older query-only page/session links are no longer interpreted; reopen the destination through the drawer to obtain a current link.
