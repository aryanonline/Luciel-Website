import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";
import { Eyebrow } from "@/components/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Placeholder = ({ label }: { label: string }) => (
  <div className="mt-8 rounded-xl border border-border bg-card p-8">
    <div className="eyebrow">{label}</div>
    <p className="mt-4 text-base text-muted-foreground">Coming with our next release.</p>
  </div>
);

const Account = ({ defaultTab = "profile" }: { defaultTab?: "profile" | "billing" }) => (
  <SiteLayout>
    <Seo
      title="Account — VantageMind AI"
      description="Account management for Luciel customers."
      path={defaultTab === "billing" ? "/account/billing" : "/account"}
    />
    <section className="border-b border-border">
      <div className="container-narrow pt-28 pb-24 md:pt-40 md:pb-32">
        <Eyebrow>ACCOUNT</Eyebrow>
        <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Account management.
        </h1>

        <Tabs defaultValue={defaultTab} className="mt-12 max-w-2xl">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="profile"><Placeholder label="Profile" /></TabsContent>
          <TabsContent value="billing"><Placeholder label="Billing" /></TabsContent>
        </Tabs>
      </div>
    </section>
  </SiteLayout>
);

export default Account;
