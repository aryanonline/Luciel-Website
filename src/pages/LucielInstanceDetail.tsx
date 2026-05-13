/**
 * LucielInstanceDetail.tsx — Step 32 single-instance surface.
 *
 * Reached from /dashboard/luciels/:pk. Three sub-tabs:
 *
 *   * Configure — PATCH /admin/luciel-instances/:pk to edit
 *                 display_name, description, system_prompt, allowed_tools,
 *                 active.
 *
 *   * Test      — mints a throwaway embed key pinned to THIS instance
 *                 (Step 31.2 commit B) and lets the operator chat
 *                 against /api/v1/chat/widget with it. Highest fidelity:
 *                 we exercise the exact runtime path Sarah's visitors
 *                 will hit. The key origins=['*'] and a short display
 *                 name so it's clearly a test artifact in the audit
 *                 trail.
 *
 *   * Deploy    — the v1 deploy flow per Sarah's vision:
 *                   1. Operator enters site origin(s) + branding
 *                   2. Backend mints embed key pinned to luciel_instance_id
 *                   3. UI renders the <script> snippet the operator
 *                      pastes on their site
 *                 Re-minting is possible (each click issues a new key);
 *                 deactivation lives behind /admin/api-keys/:id DELETE
 *                 (future surface).
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/billing";
import {
  AdminApiError,
  EmbedKey,
  LucielInstance,
  createEmbedKey,
  getLucielInstance,
  updateLucielInstance,
} from "@/lib/admin";

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-8">{children}</div>
);

// --------------------------------------------------------------------- //
// Configure sub-tab
// --------------------------------------------------------------------- //

const ConfigureTab = ({
  instance,
  onUpdated,
}: {
  instance: LucielInstance;
  onUpdated: (next: LucielInstance) => void;
}) => {
  const [displayName, setDisplayName] = useState(instance.display_name);
  const [description, setDescription] = useState(instance.description ?? "");
  const [systemPrompt, setSystemPrompt] = useState(
    instance.system_prompt_additions ?? "",
  );
  const [submitting, setSubmitting] = useState(false);

  const onSave = async () => {
    setSubmitting(true);
    try {
      const next = await updateLucielInstance(instance.id, {
        display_name: displayName.trim(),
        description: description.trim() || null,
        system_prompt_additions: systemPrompt.trim() || null,
      });
      onUpdated(next);
      toast.success("Saved.");
    } catch (err) {
      const msg =
        err instanceof AdminApiError ? err.message : "Couldn't save changes.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <Label htmlFor="cfg-name">Display name</Label>
          <Input
            id="cfg-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={200}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="cfg-desc">Description</Label>
          <Input
            id="cfg-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="cfg-prompt">Persona &amp; instructions</Label>
          <Textarea
            id="cfg-prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            className="mt-2"
          />
        </div>
        <div>
          <Button onClick={onSave} disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

// --------------------------------------------------------------------- //
// Test sub-tab — mints throwaway embed key, drives /chat/widget
// --------------------------------------------------------------------- //

interface TestKey {
  apiKey: string;
  prefix: string;
}

const TestTab = ({ instance }: { instance: LucielInstance }) => {
  const [testKey, setTestKey] = useState<TestKey | null>(null);
  const [minting, setMinting] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "luciel"; text: string }>
  >([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const mintTestKey = async () => {
    setMinting(true);
    try {
      const res = await createEmbedKey({
        tenant_id: instance.scope_owner_tenant_id,
        domain_id: instance.scope_owner_domain_id ?? undefined,
        luciel_instance_id: instance.id,
        display_name: `[test] dashboard chat — ${instance.instance_id}`,
        // origins=['*'] is fine for a test artifact; clearly tagged in the
        // audit log. Production deploy uses the Deploy tab with real origins.
        allowed_origins: ["*"],
        widget_branding_color: "#0E7C5A",
        greeting_message: "Test chat — try a message.",
      });
      setTestKey({ apiKey: res.api_key, prefix: res.embed_key.key_prefix });
      setMessages([]);
      toast.success("Test key minted.");
    } catch (err) {
      const msg =
        err instanceof AdminApiError
          ? err.message
          : "Couldn't mint a test key.";
      toast.error(msg);
    } finally {
      setMinting(false);
    }
  };

  const sendMessage = async () => {
    if (!testKey || !input.trim() || streaming) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setStreaming(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/chat/widget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${testKey.apiKey}`,
        },
        body: JSON.stringify({ message: userMsg }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`Widget responded ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let collected = "";

      // Append a placeholder we mutate as tokens arrive.
      setMessages((m) => [...m, { role: "luciel", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const raw of lines) {
          const line = raw.trim();
          if (!line) continue;
          // Each frame is one JSON object per chat_widget.py.
          try {
            const frame = JSON.parse(line.startsWith("data:") ? line.slice(5).trim() : line);
            if (frame.token) {
              collected += frame.token;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "luciel", text: collected };
                return copy;
              });
            }
            // frame.session_id (first frame) + frame.done (last) are ignored
          } catch {
            // not a JSON frame — ignore non-JSON keepalive lines
          }
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Chat request failed.";
      toast.error(msg);
    } finally {
      setStreaming(false);
    }
  };

  if (!testKey) {
    return (
      <Card>
        <div className="eyebrow">Test chat</div>
        <p className="mt-4 text-base text-muted-foreground">
          Mint a throwaway embed key to chat with this Luciel using the same
          runtime path your visitors will hit. The key is tagged{" "}
          <span className="font-mono">[test]</span> in your audit log.
        </p>
        <Button className="mt-6" onClick={mintTestKey} disabled={minting}>
          {minting ? "Minting…" : "Start test chat"}
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow">Test chat</div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            key: {testKey.prefix}…
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            setTestKey(null);
            setMessages([]);
          }}
        >
          New test key
        </Button>
      </div>

      <div className="mt-6 max-h-96 space-y-3 overflow-y-auto rounded-lg border border-border bg-background p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Send a message to start the conversation.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 text-sm ${
              m.role === "user"
                ? "ml-12 bg-primary/10 text-foreground"
                : "mr-12 bg-card text-foreground"
            }`}
          >
            <div className="mb-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {m.role === "user" ? "You" : instance.display_name}
            </div>
            <div className="whitespace-pre-wrap">{m.text || "…"}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void sendMessage();
            }
          }}
          placeholder="Type a message…"
          disabled={streaming}
        />
        <Button onClick={() => void sendMessage()} disabled={streaming || !input.trim()}>
          {streaming ? "…" : "Send"}
        </Button>
      </div>
    </Card>
  );
};

// --------------------------------------------------------------------- //
// Deploy sub-tab — mints production embed key, renders snippet
// --------------------------------------------------------------------- //

const DeployTab = ({ instance }: { instance: LucielInstance }) => {
  const [origins, setOrigins] = useState("");
  const [displayName, setDisplayName] = useState(
    `${instance.display_name} (web widget)`,
  );
  const [brandingColor, setBrandingColor] = useState("#0E7C5A");
  const [greeting, setGreeting] = useState(
    "Hi! How can I help you today?",
  );
  const [submitting, setSubmitting] = useState(false);
  const [minted, setMinted] = useState<{ key: EmbedKey; apiKey: string } | null>(
    null,
  );

  const onMint = async () => {
    const list = origins
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length === 0) {
      toast.error("Add at least one site origin.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createEmbedKey({
        tenant_id: instance.scope_owner_tenant_id,
        domain_id: instance.scope_owner_domain_id ?? undefined,
        luciel_instance_id: instance.id,
        display_name: displayName.trim() || `${instance.display_name} (web widget)`,
        allowed_origins: list,
        widget_branding_color: brandingColor,
        greeting_message: greeting,
      });
      setMinted({ key: res.embed_key, apiKey: res.api_key });
      toast.success("Embed key minted. Copy the snippet below.");
    } catch (err) {
      const msg =
        err instanceof AdminApiError ? err.message : "Couldn't mint the key.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const snippet = minted
    ? `<script
  src="${API_BASE_URL}/widget.js"
  data-luciel-key="${minted.apiKey}"
  async defer></script>`
    : "";

  return (
    <div className="space-y-6">
      <Card>
        <div className="eyebrow">Deploy widget</div>
        <p className="mt-4 text-sm text-muted-foreground">
          We'll mint an embed key pinned to <b>{instance.display_name}</b> and
          give you a snippet to paste into your site's <code>&lt;head&gt;</code>.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <Label htmlFor="dep-origins">Site origins</Label>
            <Textarea
              id="dep-origins"
              value={origins}
              onChange={(e) => setOrigins(e.target.value)}
              placeholder={"https://sarah-realty.example.com\nhttps://www.sarah-realty.example.com"}
              rows={3}
              className="mt-2 font-mono text-sm"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              One per line. The widget will refuse to load from any other
              origin.
            </p>
          </div>

          <div>
            <Label htmlFor="dep-name">Key display name</Label>
            <Input
              id="dep-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="dep-color">Branding color</Label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="dep-color"
                  type="color"
                  value={brandingColor}
                  onChange={(e) => setBrandingColor(e.target.value)}
                  className="h-10 w-12 rounded border border-border bg-card"
                />
                <Input
                  value={brandingColor}
                  onChange={(e) => setBrandingColor(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dep-greeting">Greeting</Label>
              <Input
                id="dep-greeting"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <Button onClick={onMint} disabled={submitting}>
            {submitting ? "Minting…" : minted ? "Mint another key" : "Mint embed key"}
          </Button>
        </div>
      </Card>

      {minted && (
        <Card>
          <div className="eyebrow">Your embed snippet</div>
          <p className="mt-4 text-sm text-muted-foreground">
            Paste this in the <code>&lt;head&gt;</code> of every page where
            you want Luciel to appear. We won't show the full key again — copy
            it now.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs text-foreground">
            {snippet}
          </pre>
          <div className="mt-4 flex gap-3">
            <Button
              onClick={() => {
                navigator.clipboard
                  .writeText(snippet)
                  .then(() => toast.success("Copied"))
                  .catch(() => toast.error("Copy failed"));
              }}
            >
              Copy snippet
            </Button>
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            key prefix: {minted.key.key_prefix} · pinned to instance pk{" "}
            {minted.key.luciel_instance_id}
          </p>
        </Card>
      )}
    </div>
  );
};

// --------------------------------------------------------------------- //
// Page root
// --------------------------------------------------------------------- //

const LucielInstanceDetail = () => {
  const { pk } = useParams<{ pk: string }>();
  const [instance, setInstance] = useState<LucielInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pk) return;
    const n = Number(pk);
    if (!Number.isFinite(n)) {
      setError("Invalid Luciel id.");
      return;
    }
    getLucielInstance(n)
      .then(setInstance)
      .catch((err: unknown) => {
        const msg =
          err instanceof AdminApiError
            ? err.message
            : "Couldn't load this Luciel.";
        setError(msg);
      });
  }, [pk]);

  return (
    <SiteLayout>
      <Seo
        title={instance ? `${instance.display_name} — Dashboard` : "Luciel — Dashboard"}
        description="Configure, test, and deploy your Luciel."
        path={`/dashboard/luciels/${pk ?? ""}`}
      />
      <section className="border-b border-border">
        <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <span>/</span>
            <span>Luciels</span>
          </div>

          {error && (
            <Card>
              <p className="mt-4 text-base text-muted-foreground">{error}</p>
              <Button asChild className="mt-4">
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
            </Card>
          )}

          {!error && !instance && (
            <Card>
              <p className="mt-4 text-base text-muted-foreground">Loading…</p>
            </Card>
          )}

          {!error && instance && (
            <>
              <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight md:text-6xl">
                {instance.display_name}
              </h1>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                {instance.instance_id}
              </p>

              <Tabs defaultValue="configure" className="mt-12">
                <TabsList>
                  <TabsTrigger value="configure">Configure</TabsTrigger>
                  <TabsTrigger value="test">Test</TabsTrigger>
                  <TabsTrigger value="deploy">Deploy</TabsTrigger>
                </TabsList>
                <TabsContent value="configure" className="mt-8">
                  <ConfigureTab instance={instance} onUpdated={setInstance} />
                </TabsContent>
                <TabsContent value="test" className="mt-8">
                  <TestTab instance={instance} />
                </TabsContent>
                <TabsContent value="deploy" className="mt-8">
                  <DeployTab instance={instance} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default LucielInstanceDetail;
