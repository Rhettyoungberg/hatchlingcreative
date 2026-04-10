import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MoveBreak by Hatchling Creative",
  description:
    "Privacy Policy for MoveBreak. We're privacy-first: all data stored on-device, no accounts required, no third-party analytics, no advertising or tracking.",
  robots: "index, follow",
  alternates: {
    canonical: "https://hatchlingcreative.com/movebreak/privacy/",
  },
  openGraph: {
    type: "website",
    url: "https://hatchlingcreative.com/movebreak/privacy/",
    title: "Privacy Policy | MoveBreak by Hatchling Creative",
    description:
      "Privacy Policy for MoveBreak. We're privacy-first: all data stored on-device, no accounts required, no third-party analytics.",
    siteName: "Hatchling Creative",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | MoveBreak by Hatchling Creative",
    description:
      "Privacy Policy for MoveBreak. We're privacy-first: all data stored on-device, no accounts required, no third-party analytics.",
  },
};

export default function MoveBreakPrivacyPage() {
  return (
    <div className="min-h-screen bg-void text-white">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ filter: "blur(80px)" }}>
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: "60vmax",
            height: "60vmax",
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            top: "-20%",
            left: "-10%",
          }}
        />
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: "50vmax",
            height: "50vmax",
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            top: "50%",
            right: "-20%",
          }}
        />
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: "45vmax",
            height: "45vmax",
            background: "radial-gradient(circle, #14b8a6 0%, transparent 70%)",
            bottom: "-20%",
            left: "30%",
          }}
        />
      </div>

      {/* Hero */}
      <div className="px-6 pt-20 pb-15 text-center relative">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 text-sm mb-5 hover:text-white/80 transition-colors"
        >
          ← Back to Hatchling Creative
        </Link>
        <h1 className="font-serif text-4xl font-bold text-white mb-2 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-[15px] text-white/60">MoveBreak by Hatchling Creative</p>
      </div>

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-6 pb-20 relative">
        {/* Effective date */}
        <div className="mb-8">
          <span className="inline-block text-[13px] font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-4 py-1.5 rounded-full tracking-wide">
            Effective: March 3, 2026
          </span>
        </div>

        {/* Privacy banner */}
        <div className="bg-cyan-400/5 border border-cyan-400/15 rounded-2xl p-7 mb-10 text-center">
          <h3 className="text-lg font-bold text-white mb-3">Your Privacy at a Glance</h3>
          <p className="text-sm text-white/60 mb-1">
            MoveBreak is built with a privacy-first architecture. Here&apos;s what that means:
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {[
              { icon: "✓", color: "text-green-400", text: "All data stored on-device" },
              { icon: "✓", color: "text-green-400", text: "No user accounts required" },
              { icon: "✓", color: "text-green-400", text: "No third-party analytics" },
              { icon: "✓", color: "text-green-400", text: "No advertising or tracking" },
              { icon: "✗", color: "text-red-400", text: "No data sold to third parties" },
              { icon: "✗", color: "text-red-400", text: "No cloud sync or remote servers" },
            ].map(({ icon, color, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-white/90"
              >
                <span className={color}>{icon}</span> {text}
              </span>
            ))}
          </div>
        </div>

        {/* Intro */}
        <p className="text-base text-white/70 mb-10 pb-8 border-b border-white/10 leading-relaxed">
          This Privacy Policy describes how Hatchling Creative (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and protects your information when you use the MoveBreak mobile application (&ldquo;App&rdquo;). We are committed to transparency about our data practices. Please read this policy carefully. By using MoveBreak, you agree to the practices described herein.
        </p>

        {/* Table of Contents */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-7 mb-10">
          <h3 className="text-[14px] font-bold tracking-widest uppercase text-white/50 mb-4">
            Table of Contents
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            {[
              ["#p1", "Information We Collect"],
              ["#p2", "How We Use Your Information"],
              ["#p3", "Data Storage & Security"],
              ["#p4", "Apple HealthKit Data"],
              ["#p5", "Calendar Data"],
              ["#p6", "Notifications & On-Device AI"],
              ["#p7", "Subscription & Payment Data"],
              ["#p8", "Third-Party Services"],
              ["#p9", "Data Sharing & Disclosure"],
              ["#p10", "Data Retention & Deletion"],
              ["#p11", "Children&apos;s Privacy"],
              ["#p12", "International Users"],
              ["#p13", "Your Rights"],
              ["#p14", "California Privacy Rights (CCPA)"],
              ["#p15", "European Privacy Rights (GDPR)"],
              ["#p16", "Changes to This Policy"],
              ["#p17", "Contact Us"],
            ].map(([href, label]) => (
              <li key={href} className="text-[15px] text-cyan-400 pl-1">
                <a href={href} className="hover:text-cyan-300 transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Section 1 */}
        <section id="p1" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 1
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Information We Collect
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak collects the minimum amount of information necessary to provide you with a personalized wellness experience. All data is stored locally on your device and is never transmitted to our servers.
          </p>

          {/* Data table */}
          <div className="overflow-x-auto my-5">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 bg-white/[0.03] border border-white/10 font-semibold text-white text-[13px] tracking-wide">Data</th>
                  <th className="text-left px-4 py-3 bg-white/[0.03] border border-white/10 font-semibold text-white text-[13px] tracking-wide">Purpose</th>
                  <th className="text-left px-4 py-3 bg-white/[0.03] border border-white/10 font-semibold text-white text-[13px] tracking-wide">Storage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { data: "First name", purpose: "Personalized notifications (e.g., \"Rhett, time to move!\")", badge: "On-Device", badgeClass: "bg-cyan-400/15 text-cyan-400" },
                  { data: "Work schedule", purpose: "Scheduling reminders within your work hours", badge: "On-Device", badgeClass: "bg-cyan-400/15 text-cyan-400" },
                  { data: "Body area preferences", purpose: "Tailoring exercise recommendations to your problem areas", badge: "On-Device", badgeClass: "bg-cyan-400/15 text-cyan-400" },
                  { data: "Movement history", purpose: "Tracking completions, calculating streaks, and showing stats", badge: "On-Device", badgeClass: "bg-cyan-400/15 text-cyan-400" },
                  { data: "Favorite movements", purpose: "Quick access to exercises you enjoy", badge: "On-Device", badgeClass: "bg-cyan-400/15 text-cyan-400" },
                  { data: "Streak data", purpose: "Displaying current and longest movement streaks", badge: "On-Device", badgeClass: "bg-cyan-400/15 text-cyan-400" },
                  { data: "App preferences", purpose: "Sound, haptic, voice guidance, notification tone and persistence settings", badge: "On-Device", badgeClass: "bg-cyan-400/15 text-cyan-400" },
                  { data: "Subscription status", purpose: "Determining free vs. premium feature access", badge: "Apple StoreKit", badgeClass: "bg-blue-400/15 text-blue-400" },
                ].map(({ data, purpose, badge, badgeClass }, i) => (
                  <tr key={data} className={i % 2 === 1 ? "bg-white/[0.02]" : ""}>
                    <td className="px-4 py-3 border border-white/10 text-white/70 align-top font-semibold text-white">{data}</td>
                    <td className="px-4 py-3 border border-white/10 text-white/70 align-top">{purpose}</td>
                    <td className="px-4 py-3 border border-white/10 text-white/70 align-top">
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wide ${badgeClass}`}>
                        {badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Information we do NOT collect:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Email addresses or passwords</li>
            <li>GPS location or geographic data</li>
            <li>Device identifiers (IDFA, device UUID)</li>
            <li>IP addresses</li>
            <li>Browsing history or app usage analytics</li>
            <li>Photos, contacts, or microphone data</li>
            <li>Financial information (handled entirely by Apple)</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section id="p2" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 2
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            How We Use Your Information
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            All data processing occurs locally on your device. We use your information exclusively to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li><strong className="text-white font-semibold">Deliver core functionality</strong> — generating personalized movement recommendations based on your location, body areas, and energy level</li>
            <li><strong className="text-white font-semibold">Schedule reminders</strong> — sending notifications at appropriate times during your work hours, avoiding meeting conflicts</li>
            <li><strong className="text-white font-semibold">Personalize notifications</strong> — using your name and preferences to create motivating, tone-appropriate reminder messages</li>
            <li><strong className="text-white font-semibold">Track your progress</strong> — calculating movement streaks, completion counts, and daily/weekly statistics</li>
            <li><strong className="text-white font-semibold">Log workouts to HealthKit</strong> — recording completed movements as health data (only with your explicit permission)</li>
            <li><strong className="text-white font-semibold">Manage your subscription</strong> — determining whether you have access to free or premium features</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            We do not use your data for advertising, profiling, market research, or any purpose beyond providing the App&apos;s functionality.
          </p>
        </section>

        {/* Section 3 */}
        <section id="p3" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 3
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Data Storage &amp; Security
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            All personal data is stored locally on your device using Apple&apos;s SwiftData framework, which leverages the device&apos;s native encryption and security protections. Specifically:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li><strong className="text-white font-semibold">On-device encryption</strong> — Data is protected by your device&apos;s hardware encryption and passcode/biometric lock</li>
            <li><strong className="text-white font-semibold">No cloud backup by default</strong> — MoveBreak data may be included in your iCloud device backup if you have iCloud Backup enabled on your device, subject to Apple&apos;s iCloud security practices</li>
            <li><strong className="text-white font-semibold">No remote storage</strong> — We do not operate servers that receive, store, or process your personal data</li>
            <li><strong className="text-white font-semibold">No database or backend</strong> — There is no Hatchling Creative database containing your information</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            Because we never receive your data, risks associated with data breaches, unauthorized server access, or database compromises do not apply to MoveBreak&apos;s data practices.
          </p>
        </section>

        {/* Section 4 */}
        <section id="p4" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 4
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Apple HealthKit Data
          </h2>
          <div className="bg-cyan-400/[0.08] border border-cyan-400/20 rounded-xl px-6 py-5 my-5">
            <p className="text-white font-medium">
              HealthKit integration is entirely optional and requires your explicit authorization. You can revoke access at any time through your device&apos;s Settings → Health → MoveBreak.
            </p>
          </div>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Data we write to HealthKit:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Workout records (type: &ldquo;Mind and Body&rdquo;) for each completed movement</li>
            <li>Active energy burned (estimated at approximately 3 calories per minute of movement)</li>
            <li>Workout metadata: movement name, location category, movement type, and &ldquo;MoveBreak&rdquo; brand identifier</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            <strong className="text-white font-semibold">Data we read from HealthKit:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Apple Stand Hour data — aggregate count of hours stood today</li>
            <li>Time since last recorded stand event</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            <strong className="text-white font-semibold">HealthKit data commitments (per Apple&apos;s requirements):</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>We will <strong className="text-white font-semibold">never</strong> use HealthKit data for advertising or marketing purposes</li>
            <li>We will <strong className="text-white font-semibold">never</strong> sell HealthKit data to third parties, including data brokers, advertising networks, or analytics providers</li>
            <li>We will <strong className="text-white font-semibold">never</strong> share HealthKit data with third parties for any purpose unrelated to providing health or fitness functionality to you</li>
            <li>We will <strong className="text-white font-semibold">never</strong> use HealthKit data for purposes not disclosed in this Privacy Policy</li>
            <li>HealthKit data is processed and used solely on your device to provide the features described above</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="p5" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 5
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Calendar Data
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            If you enable the &ldquo;Skip during meetings&rdquo; feature, MoveBreak requests read-only access to your device calendar through Apple&apos;s EventKit framework.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">What we access:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Start and end times of non-all-day calendar events for the current day and the next day</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            <strong className="text-white font-semibold">What we do NOT access:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Event titles, descriptions, or notes</li>
            <li>Attendee names, email addresses, or contact details</li>
            <li>Event locations or URLs</li>
            <li>Calendar names or account information</li>
            <li>Recurring event patterns</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            Calendar data is processed in memory, used solely to determine busy periods for notification scheduling, and is never persisted to storage or transmitted anywhere. You can revoke calendar access at any time through Settings → Privacy &amp; Security → Calendars.
          </p>
        </section>

        {/* Section 6 */}
        <section id="p6" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 6
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Notifications &amp; On-Device AI
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Notification scheduling:</strong> MoveBreak schedules local notifications using Apple&apos;s UserNotifications framework. Notifications are created and scheduled entirely on your device. No notification data is sent to our servers or to any push notification service operated by us.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Notification personalization:</strong> To create personalized notification messages, the App uses contextual data including your first name, notification tone preference, current streak, movement count, problem body areas, and time of day. This data is processed locally.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">On-device AI:</strong> On devices running iOS 26 or later with Apple Intelligence support, MoveBreak may use Apple&apos;s on-device Foundation Models framework to generate notification text. This processing occurs entirely on your device&apos;s neural engine. No data is transmitted to Apple&apos;s servers, Hatchling Creative&apos;s servers, or any third party for AI processing. On unsupported devices, pre-written message templates are used instead.
          </p>
        </section>

        {/* Section 7 */}
        <section id="p7" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 7
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Subscription &amp; Payment Data
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak Premium subscriptions are processed entirely through Apple&apos;s App Store using StoreKit 2. We do not collect, process, or store any financial information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Credit card or debit card numbers</li>
            <li>Bank account information</li>
            <li>Apple ID credentials</li>
            <li>Billing addresses</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            The only subscription-related data stored locally on your device is your current subscription status (active or inactive), which is verified through Apple&apos;s transaction verification system. For Apple&apos;s payment data practices, please refer to{" "}
            <a href="https://www.apple.com/legal/privacy/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Apple&apos;s Privacy Policy
            </a>.
          </p>
        </section>

        {/* Section 8 */}
        <section id="p8" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 8
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Third-Party Services
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak uses the following third-party components:
          </p>

          <div className="overflow-x-auto my-5">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3 bg-white/[0.03] border border-white/10 font-semibold text-white text-[13px] tracking-wide">Service</th>
                  <th className="text-left px-4 py-3 bg-white/[0.03] border border-white/10 font-semibold text-white text-[13px] tracking-wide">Purpose</th>
                  <th className="text-left px-4 py-3 bg-white/[0.03] border border-white/10 font-semibold text-white text-[13px] tracking-wide">Data Access</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: "Apple StoreKit 2", purpose: "Subscription management and payment processing", access: "Transaction data processed by Apple", badge: null },
                  { service: "Apple HealthKit", purpose: "Workout logging and stand hour tracking", access: "Health data on-device only (with permission)", badge: null },
                  { service: "Apple EventKit", purpose: "Calendar busy period detection", access: "Event times on-device only (with permission)", badge: null },
                  { service: "Apple Foundation Models", purpose: "On-device AI for notification text generation", access: null, badge: { text: "No data shared", cls: "bg-green-400/15 text-green-400" } },
                  { service: "Lottie (lottie-ios)", purpose: "Exercise animation rendering", access: null, badge: { text: "No data shared", cls: "bg-green-400/15 text-green-400" } },
                ].map(({ service, purpose, access, badge }, i) => (
                  <tr key={service} className={i % 2 === 1 ? "bg-white/[0.02]" : ""}>
                    <td className="px-4 py-3 border border-white/10 text-white/70 align-top font-semibold text-white">{service}</td>
                    <td className="px-4 py-3 border border-white/10 text-white/70 align-top">{purpose}</td>
                    <td className="px-4 py-3 border border-white/10 text-white/70 align-top">
                      {badge ? (
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wide ${badge.cls}`}>
                          {badge.text}
                        </span>
                      ) : access}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak does <strong className="text-white font-semibold">not</strong> use any third-party analytics services (such as Firebase Analytics, Amplitude, or Mixpanel), crash reporting tools (such as Crashlytics or Sentry), advertising networks, attribution or tracking SDKs, or social media SDKs.
          </p>
        </section>

        {/* Section 9 */}
        <section id="p9" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 9
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Data Sharing &amp; Disclosure
          </h2>
          <div className="bg-cyan-400/[0.08] border border-cyan-400/20 rounded-xl px-6 py-5 my-5">
            <p className="text-white font-medium">
              We do not sell, rent, trade, or otherwise share your personal data with any third party.
            </p>
          </div>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            Because MoveBreak operates without a backend server and stores all data locally on your device, there is no mechanism through which we could access, share, or sell your personal information. The only circumstances under which your data might be disclosed are:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li><strong className="text-white font-semibold">Apple HealthKit</strong> — Workout data you choose to write to HealthKit becomes available to other apps you have authorized through the Health app, subject to Apple&apos;s HealthKit sharing controls</li>
            <li><strong className="text-white font-semibold">iCloud Backup</strong> — If you use iCloud Backup, your device backup may include MoveBreak&apos;s local data, subject to Apple&apos;s iCloud encryption and privacy practices</li>
            <li><strong className="text-white font-semibold">Legal requirements</strong> — We would comply with valid legal process (such as a court order or subpoena) requiring disclosure. However, since we do not possess your data, we would have no data to produce in response to such requests</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section id="p10" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 10
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Data Retention &amp; Deletion
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Local data:</strong> Your data persists on your device for as long as MoveBreak is installed. You have full control over your data at all times.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">To delete all MoveBreak data:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Delete the MoveBreak app from your device. This permanently removes all locally stored data including your preferences, movement history, streaks, and favorites.</li>
            <li>To remove HealthKit data written by MoveBreak, go to Settings → Health → Data Access &amp; Devices → MoveBreak → Delete All Data from MoveBreak.</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            <strong className="text-white font-semibold">Subscription data:</strong> Your subscription status is managed by Apple. Canceling your subscription or deleting the app does not automatically trigger a refund. Subscription management is handled through your Apple ID account settings.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            Because we do not store your data on our servers, there is no server-side data to request deletion of.
          </p>
        </section>

        {/* Section 11 */}
        <section id="p11" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 11
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Children&apos;s Privacy
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. Since MoveBreak does not transmit data to our servers, we cannot identify whether a user is a child.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            If you are a parent or guardian and believe your child under 13 is using MoveBreak, the most effective action is to delete the app from the child&apos;s device, which will remove all stored data. You may also contact us at the address below with any concerns.
          </p>
        </section>

        {/* Section 12 */}
        <section id="p12" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 12
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            International Users
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak is available internationally through the Apple App Store. Because all data processing occurs locally on your device and we do not operate servers that receive your data, there is no cross-border data transfer associated with your use of MoveBreak.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            Your subscription transactions are processed by Apple through their global infrastructure, subject to Apple&apos;s own privacy practices and data transfer mechanisms. For information about how Apple handles your payment data internationally, please refer to{" "}
            <a href="https://www.apple.com/legal/privacy/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Apple&apos;s Privacy Policy
            </a>.
          </p>
        </section>

        {/* Section 13 */}
        <section id="p13" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 13
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Your Rights
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            Depending on your jurisdiction, you may have rights regarding your personal data. Because MoveBreak stores all data locally on your device and we do not have access to it, you exercise these rights directly through your device:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li><strong className="text-white font-semibold">Right to access</strong> — Your data is visible within the App&apos;s settings, progress screens, and library. All data is on your device and accessible to you at all times.</li>
            <li><strong className="text-white font-semibold">Right to correction</strong> — You can modify your name, preferences, and settings directly in the App at any time.</li>
            <li><strong className="text-white font-semibold">Right to deletion</strong> — Delete the App to permanently remove all stored data. Remove HealthKit data through the Health app&apos;s settings.</li>
            <li><strong className="text-white font-semibold">Right to portability</strong> — Movement data written to HealthKit can be exported through Apple&apos;s Health app. Other in-app data is stored in a local database on your device.</li>
            <li><strong className="text-white font-semibold">Right to object to processing</strong> — You can disable any optional feature (HealthKit, calendar access, notifications) at any time through the App&apos;s settings or your device&apos;s system settings.</li>
            <li><strong className="text-white font-semibold">Right to restrict processing</strong> — Individual features that access device capabilities can be toggled off independently.</li>
          </ul>
        </section>

        {/* Section 14 */}
        <section id="p14" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 14
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            California Privacy Rights (CCPA/CPRA)
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            If you are a California resident, the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA) provide you with specific rights regarding your personal information.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Categories of personal information collected:</strong> Identifiers (first name only), health and fitness data (via HealthKit, with permission), and inferences drawn from the above (exercise recommendations).
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Sale or sharing of personal information:</strong> We do <strong className="text-white font-semibold">not</strong> sell or share your personal information as defined under the CCPA/CPRA. We have not sold or shared personal information in the preceding 12 months.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Your CCPA/CPRA rights:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li><strong className="text-white font-semibold">Right to know</strong> — This Privacy Policy describes all categories of personal information we collect and how it is used. Since all data is on your device, you already have full access.</li>
            <li><strong className="text-white font-semibold">Right to delete</strong> — Delete the App to remove all data. We hold no server-side data to delete.</li>
            <li><strong className="text-white font-semibold">Right to opt-out of sale/sharing</strong> — We do not sell or share your data, so no opt-out is necessary.</li>
            <li><strong className="text-white font-semibold">Right to non-discrimination</strong> — We will not discriminate against you for exercising your privacy rights.</li>
          </ul>
        </section>

        {/* Section 15 */}
        <section id="p15" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 15
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            European Privacy Rights (GDPR)
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland, the General Data Protection Regulation (GDPR) and equivalent local laws provide you with additional rights.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Legal basis for processing:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li><strong className="text-white font-semibold">Contract performance</strong> — Processing your preferences and activity data is necessary to deliver the App&apos;s core functionality that you have requested.</li>
            <li><strong className="text-white font-semibold">Consent</strong> — HealthKit access, calendar access, and notification delivery each require your explicit opt-in consent, which you may withdraw at any time.</li>
            <li><strong className="text-white font-semibold">Legitimate interest</strong> — Verifying subscription status to enforce the terms of our free and premium tiers.</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            <strong className="text-white font-semibold">Data controller:</strong> Hatchling Creative is the data controller. However, because all processing occurs on your device and we do not receive or store your data on our servers, our role as controller is limited to the design and functionality of the App itself.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Data transfers:</strong> MoveBreak does not transfer your personal data outside of your device. Subscription transactions processed by Apple may involve transfers subject to Apple&apos;s own GDPR compliance measures, including Standard Contractual Clauses.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Your GDPR rights</strong> — including access, rectification, erasure, restriction, portability, and objection — can be exercised as described in Section 13 above. For additional inquiries, contact us at the address below.
          </p>
        </section>

        {/* Section 16 */}
        <section id="p16" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 16
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Changes to This Policy
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make changes, we will update the &ldquo;Effective&rdquo; date at the top of this page.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            For material changes that affect how we handle your data, we will make reasonable efforts to notify you through the App or by other appropriate means before the changes take effect. Your continued use of MoveBreak after the updated Privacy Policy becomes effective constitutes your acceptance of the changes.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We encourage you to review this Privacy Policy periodically.
          </p>
        </section>

        {/* Section 17 */}
        <section id="p17" className="mb-9">
          <div className="text-[12px] font-bold text-cyan-400 tracking-[1.5px] uppercase mb-2">
            Section 17
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Contact Us
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            If you have questions, concerns, or requests related to this Privacy Policy or MoveBreak&apos;s data practices, please contact us:
          </p>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 my-5">
            <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-2">
              <strong className="text-white font-semibold">Hatchling Creative</strong>
            </p>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-2">
              Email:{" "}
              <a href="mailto:privacy@hatchlingcreative.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                privacy@hatchlingcreative.com
              </a>
            </p>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed">
              Web:{" "}
              <a href="https://hatchlingcreative.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                hatchlingcreative.com
              </a>
            </p>
          </div>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We aim to respond to all privacy-related inquiries within 30 days.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center px-6 py-10 border-t border-white/10">
        <p className="text-[13px] text-white/40 mb-2">&copy; 2026 Hatchling Creative. All rights reserved.</p>
        <p className="text-[13px] text-white/40">
          <Link href="/movebreak/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">Privacy Policy</Link>
          {" · "}
          <Link href="/movebreak/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms of Use</Link>
        </p>
      </footer>
    </div>
  );
}
