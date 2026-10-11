import React from 'react';

export default function Nominate() {
  const html = `
<form data-screen-label="Nominate · Form" onSubmit="{{ submit }}" novalidate="" style="font-family:var(--font-ui);display:flex;flex-direction:column;gap:32px;max-width:560px;width:100%">
  <ol aria-label="Progress" style="list-style:none;margin:0;padding:0;position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr))">
    <span aria-hidden="true" style="position:absolute;left:16px;right:16px;top:15px;height:2px;background:var(--line)"></span>
    <span aria-hidden="true" style="position:absolute;left:16px;top:15px;height:2px;width:{{ lineW }};background:var(--brand-red);transition:width 400ms var(--ease-standard)"></span>
    <sc-for list="{{ steps }}" as="s" hint-placeholder-count="3">
      <li aria-current="{{ s.current }}" style="position:relative;display:flex;flex-direction:column;align-items:{{ s.align }};gap:8px">
        <span style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 14px var(--font-display);background:{{ s.bg }};color:{{ s.fg }};border:2px solid {{ s.bd }};transition:background 250ms,border-color 250ms">{{ s.mark }}</span>
        <span style="font-size:13px;font-weight:{{ s.fw }};color:{{ s.tc }}">{{ s.label }}</span>
      </li>
    </sc-for>
  </ol>
  <div ref="{{ paneRef }}" style="display:flex;flex-direction:column;gap:20px">
    <div style="display:flex;flex-direction:column;gap:6px">
      <h2 style="margin:0;font-family:var(--font-display);font-weight:700;font-size:24px;line-height:30px;color:var(--navy-900)">{{ stepTitle }}</h2>
      <p style="margin:0;font-size:15px;line-height:22px;color:var(--slate)">{{ stepSub }}</p>
    </div>
    <sc-if value="{{ s1 }}" hint-placeholder-val="{{ true }}">
      <div style="display:flex;flex-direction:column;gap:8px">
        <span style="font-size:14px;font-weight:600;color:var(--ink)">Nomination type</span>
        <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.SegmentedControl" label="Nomination type" options="{{ types }}" value="{{ v.type }}" on-change="{{ setType }}" full-width="{{ true }}" hint-size="100%,44px"></x-import>
      </div>
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Input" id="n-name" label="{{ nameLabel }}" value="{{ v.name }}" error="{{ e.name }}" on-change="{{ f.name }}" on-blur="{{ b.name }}" hint-size="100%,72px"></x-import>
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Select" id="n-ind" label="Industry" placeholder="Choose an industry" options="{{ industries }}" value="{{ v.industry }}" error="{{ e.industry }}" on-change="{{ f.industry }}" hint-size="100%,72px"></x-import>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px">
        <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Select" id="n-country" label="Country" placeholder="Choose a country" options="{{ countries }}" value="{{ v.country }}" error="{{ e.country }}" on-change="{{ f.country }}" hint-size="100%,72px"></x-import>
        <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Input" id="n-city" label="City" value="{{ v.city }}" error="{{ e.city }}" on-change="{{ f.city }}" on-blur="{{ b.city }}" hint-size="100%,72px"></x-import>
      </div>
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Input" id="n-web" type="url" label="Website or LinkedIn" optional="{{ true }}" placeholder="https://" value="{{ v.web }}" error="{{ e.web }}" on-change="{{ f.web }}" on-blur="{{ b.web }}" hint-size="100%,72px"></x-import>
    </sc-if>
    <sc-if value="{{ s2 }}" hint-placeholder-val="{{ false }}">
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Textarea" id="n-why" label="Why should we feature them?" helper="What have they built, and who has it helped? Specifics help our editors." max-length="{{ 1000 }}" rows="{{ 7 }}" value="{{ v.why }}" error="{{ e.why }}" on-change="{{ f.why }}" hint-size="100%,220px"></x-import>
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Input" id="n-links" label="Links to press or their work" optional="{{ true }}" placeholder="Paste one or more links" value="{{ v.links }}" on-change="{{ f.links }}" hint-size="100%,72px"></x-import>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px">
        <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Input" id="n-nemail" type="email" label="Nominee email" optional="{{ true }}" value="{{ v.nemail }}" error="{{ e.nemail }}" on-change="{{ f.nemail }}" on-blur="{{ b.nemail }}" hint-size="100%,72px"></x-import>
        <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Input" id="n-nphone" type="tel" label="Nominee phone" optional="{{ true }}" value="{{ v.nphone }}" on-change="{{ f.nphone }}" hint-size="100%,72px"></x-import>
      </div>
      <p style="margin:0;display:flex;gap:10px;align-items:flex-start;padding:12px 14px;background:var(--navy-50);border-radius:8px;font-size:14px;line-height:20px;color:var(--ink)">
        <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Icon" name="lock" size="{{ 18 }}" color="var(--navy-900)" hint-size="18px,18px"></x-import>
        <span>We never publish contact details. We only use them to reach the nominee if they’re shortlisted.</span>
      </p>
    </sc-if>
    <sc-if value="{{ s3 }}" hint-placeholder-val="{{ false }}">
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Input" id="n-you" label="Your name" value="{{ v.you }}" error="{{ e.you }}" on-change="{{ f.you }}" on-blur="{{ b.you }}" hint-size="100%,72px"></x-import>
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Input" id="n-email" type="email" label="Your email" helper="We’ll send your confirmation here." value="{{ v.email }}" error="{{ e.email }}" on-change="{{ f.email }}" on-blur="{{ b.email }}" hint-size="100%,72px"></x-import>
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Select" id="n-rel" label="Relationship to nominee" placeholder="Choose one" options="{{ relationships }}" value="{{ v.rel }}" error="{{ e.rel }}" on-change="{{ f.rel }}" hint-size="100%,72px"></x-import>
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Checkbox" id="n-consent" label="I confirm this nomination is accurate and I agree to the Privacy Policy." checked="{{ v.consent }}" error="{{ e.consent }}" on-change="{{ setConsent }}" hint-size="100%,44px"></x-import>
      <div aria-label="Security check" style="display:flex;align-items:center;gap:12px;width:300px;max-width:100%;height:64px;padding:0 14px;border:1px solid var(--line);border-radius:8px;background:#FAFBFD;font-size:14px;color:var(--ink)">
        <span aria-hidden="true" style="width:24px;height:24px;border-radius:50%;border:2px solid var(--navy-900);display:flex;align-items:center;justify-content:center;color:var(--navy-900);font-size:14px">✓</span>
        <span style="flex:1">Success!</span>
        <span style="font-size:10px;color:var(--slate);text-align:right;line-height:12px">Cloudflare<br>Turnstile</span>
      </div>
    </sc-if>
  </div>
  <div style="display:flex;gap:12px;justify-content:space-between;padding-top:24px;border-top:1px solid var(--line)">
    <sc-if value="{{ canBack }}" hint-placeholder-val="{{ false }}">
      <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Button" variant="ghost" icon-left="arrow-left" on-click="{{ back }}" hint-size="100px,44px">Back</x-import>
    </sc-if>
    <span style="flex:1"></span>
    <x-import component-from-global-scope="TheBuilderDesignSystem_b0f242.Button" type="submit" variant="{{ nextVariant }}" icon-right="{{ nextIcon }}" loading="{{ busy }}" hint-size="180px,44px">{{ nextLabel }}</x-import>
  </div>
</form>
  `;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
