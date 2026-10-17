import { useState } from "react";
import { useApiResource } from "@/hooks/useApiResource";
import { http, errorMessage, type ApiEnvelope } from "@/lib/http";
import { useToast } from "@/context/ToastContext";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { ResourceError } from "@/components/ui/ResourceState";

interface Channel {
  id: string;
  provider_id: string;
  title?: string | null;
  active: boolean;
  auto_publish: boolean;
  edition: string;
  last_synced_at?: string | null;
}
interface SyncRun {
  id: string;
  youtube_channel_id: string;
  status: string;
  fetched: number;
  requests: number;
  error_code?: string | null;
  started_at: string;
  finished_at?: string | null;
}
const button =
  "min-h-10 rounded-md border border-line px-4 text-sm font-semibold disabled:opacity-50";
const input =
  "mt-2 min-h-10 w-full rounded-md border border-line bg-white px-3 text-sm text-ink focus:border-royal focus:outline-none focus:ring-2 focus:ring-royal/20";
const date = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("en-GB", { timeZone: "Africa/Lagos" }) +
      " WAT"
    : "Never";
export function YouTubeControls() {
  const { toast } = useToast();
  const [page, setPage] = useState(1),
    [busy, setBusy] = useState("");
  const [draft, setDraft] = useState<Partial<Channel> | null>(null);
  const channels = useApiResource("youtube:channels", (signal) =>
    http<ApiEnvelope<Channel[]>>("/console/youtube/channels", { signal }),
  );
  const history = useApiResource("youtube:history:" + page, (signal) =>
    http<ApiEnvelope<SyncRun[]>>("/console/youtube/history", {
      signal,
      query: { page },
    }),
  );
  const refresh = () => {
    channels.retry();
    history.retry();
  };
  async function sync(channel: Channel) {
    setBusy(channel.id);
    try {
      await http("/console/youtube/channels/" + channel.id + "/sync", {
        method: "POST",
      });
      toast("Synchronization queued");
      history.retry();
    } catch (error) {
      toast(errorMessage(error), "error");
    } finally {
      setBusy("");
    }
  }
  return (
    <section
      id="youtube-channels"
      className="scroll-mt-24 space-y-5 rounded-lg border border-line bg-white p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">
          YouTube channel controls
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className={button}
            disabled={!!busy}
            onClick={refresh}
          >
            Refresh status
          </button>
          <button
            type="button"
            className={button}
            disabled={!!busy}
            onClick={() =>
              setDraft({
                provider_id: "",
                active: true,
                auto_publish: false,
                edition: "both",
              })
            }
          >
            Connect channel
          </button>
        </div>
      </div>
      <p className="text-sm text-slate">
        The private API key stays on the server. Import eligibility and
        publication are checked by the API. Saving a channel does not trigger
        synchronization.
      </p>
      {channels.loading ? (
        <LoadingDots label="Loading channels" />
      ) : channels.error ? (
        <ResourceError error={channels.error} retry={channels.retry} />
      ) : (
        <div className="space-y-3">
          {channels.data?.data.length ? (
            channels.data.data.map((channel) => (
              <div
                key={channel.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line p-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {channel.title || channel.provider_id}
                  </h3>
                  <p className="text-sm text-slate">
                    {channel.active ? "Import enabled" : "Import paused"} ·{" "}
                    {channel.auto_publish
                      ? "Automatic publication"
                      : "Editorial review"}{" "}
                    · {channel.edition}
                  </p>
                  <p className="text-xs text-slate">
                    Last synchronized: {date(channel.last_synced_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={button}
                    disabled={!!busy}
                    onClick={() => setDraft({ ...channel })}
                  >
                    Edit channel
                  </button>
                  <button
                    type="button"
                    className={button}
                    disabled={!!busy || !channel.active}
                    onClick={() => sync(channel)}
                  >
                    {busy === channel.id ? <LoadingDots /> : "Synchronize now"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate">
              No official channel is configured yet.
            </p>
          )}
        </div>
      )}
      {draft && (
        <form
          className="space-y-4 rounded-lg border border-line p-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy("save");
            try {
              await http("/console/youtube/channels", {
                method: "PUT",
                body: {
                  provider_id: draft.provider_id,
                  active: Boolean(draft.active),
                  auto_publish: Boolean(draft.auto_publish),
                  edition: draft.edition,
                },
              });
              toast("Channel configuration saved");
              setDraft(null);
              channels.retry();
            } catch (error) {
              toast(errorMessage(error), "error");
            } finally {
              setBusy("");
            }
          }}
        >
          <label className="block text-sm font-semibold">
            Official channel ID
            <input
              required
              pattern="UC[A-Za-z0-9_-]{22}"
              maxLength={24}
              readOnly={!!draft.id}
              className={input}
              placeholder="UC…"
              value={draft.provider_id || ""}
              onChange={(event) =>
                setDraft({ ...draft, provider_id: event.target.value })
              }
            />
          </label>
          <label className="flex gap-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(draft.active)}
              onChange={(event) =>
                setDraft({ ...draft, active: event.target.checked })
              }
            />
            Import eligible channel uploads automatically
          </label>
          <label className="flex gap-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(draft.auto_publish)}
              onChange={(event) =>
                setDraft({ ...draft, auto_publish: event.target.checked })
              }
            />
            Publish eligible imports automatically
          </label>
          <label className="block text-sm font-semibold">
            Edition
            <select
              className={input}
              value={draft.edition || "both"}
              onChange={(event) =>
                setDraft({ ...draft, edition: event.target.value })
              }
            >
              {["both", "Nigeria", "Australia"].map((edition) => (
                <option key={edition}>{edition}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-3">
            <button
              className={button + " bg-navy-900 text-white"}
              disabled={!!busy}
            >
              {busy === "save" ? <LoadingDots /> : "Save channel"}
            </button>
            <button
              type="button"
              className={button}
              disabled={!!busy}
              onClick={() => setDraft(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="space-y-3">
        <h3 className="font-display text-lg font-bold">
          Synchronization history
        </h3>
        {history.loading ? (
          <LoadingDots label="Loading synchronization history" />
        ) : history.error ? (
          <ResourceError error={history.error} retry={history.retry} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr>
                    {[
                      "Started (WAT)",
                      "Channel",
                      "Status",
                      "Videos checked",
                      "API requests",
                      "Error",
                    ].map((label) => (
                      <th key={label} className="p-2">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.data?.data.map((run) => (
                    <tr key={run.id} className="border-t border-line">
                      <td className="p-2">{date(run.started_at)}</td>
                      <td>
                        {channels.data?.data.find(
                          (channel) => channel.id === run.youtube_channel_id,
                        )?.provider_id || run.youtube_channel_id}
                      </td>
                      <td>{run.status}</td>
                      <td>{run.fetched}</td>
                      <td>{run.requests}</td>
                      <td>{run.error_code?.replaceAll("_", " ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!history.data?.data.length && (
              <p className="text-sm text-slate">
                No synchronization runs recorded yet.
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={button}
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} of {history.data?.last_page || 1}
              </span>
              <button
                type="button"
                className={button}
                disabled={page >= (history.data?.last_page || 1)}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
