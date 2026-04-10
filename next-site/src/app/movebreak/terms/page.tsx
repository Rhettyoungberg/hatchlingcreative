import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | MoveBreak by Hatchling Creative",
  description:
    "Terms of Use for MoveBreak, the wellness app that helps desk workers incorporate micro-movements into their workday. By Hatchling Creative.",
  robots: "index, follow",
  alternates: {
    canonical: "https://hatchlingcreative.com/movebreak/terms/",
  },
  openGraph: {
    type: "website",
    url: "https://hatchlingcreative.com/movebreak/terms/",
    title: "Terms of Use | MoveBreak by Hatchling Creative",
    description:
      "Terms of Use for MoveBreak, the wellness app that helps desk workers incorporate micro-movements into their workday.",
    siteName: "Hatchling Creative",
  },
  twitter: {
    card: "summary",
    title: "Terms of Use | MoveBreak by Hatchling Creative",
    description:
      "Terms of Use for MoveBreak, the wellness app that helps desk workers incorporate micro-movements into their workday.",
  },
};

export default function MoveBreakTermsPage() {
  return (
    <div className="min-h-screen bg-void text-white">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ filter: "blur(80px)" }}>
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: "60vmax",
            height: "60vmax",
            background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)",
            top: "-20%",
            left: "-10%",
          }}
        />
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: "50vmax",
            height: "50vmax",
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            top: "50%",
            right: "-20%",
          }}
        />
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: "45vmax",
            height: "45vmax",
            background: "radial-gradient(circle, #2563eb 0%, transparent 70%)",
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
          Terms of Use
        </h1>
        <p className="text-[15px] text-white/60">MoveBreak by Hatchling Creative</p>
      </div>

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-6 pb-20 relative">
        {/* Effective date */}
        <div className="mb-8">
          <span className="inline-block text-[13px] font-semibold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-4 py-1.5 rounded-full tracking-wide">
            Effective: March 3, 2026
          </span>
        </div>

        {/* Intro */}
        <p className="text-base text-white/70 mb-10 pb-8 border-b border-white/10 leading-relaxed">
          Welcome to MoveBreak. These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the MoveBreak mobile application (&ldquo;App&rdquo;), developed and operated by Hatchling Creative (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By downloading, installing, or using the App, you agree to be bound by these Terms. If you do not agree, please do not use the App.
        </p>

        {/* Table of Contents */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-7 mb-10">
          <h3 className="text-[14px] font-bold tracking-widest uppercase text-white/50 mb-4">
            Table of Contents
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            {[
              ["#s1", "Acceptance of Terms"],
              ["#s2", "Description of Service"],
              ["#s3", "Eligibility"],
              ["#s4", "User Accounts & Data"],
              ["#s5", "Free & Premium Tiers"],
              ["#s6", "Subscriptions & Billing"],
              ["#s7", "HealthKit Integration"],
              ["#s8", "Calendar Integration"],
              ["#s9", "Notifications"],
              ["#s10", "On-Device AI Features"],
              ["#s11", "Acceptable Use"],
              ["#s12", "Intellectual Property"],
              ["#s13", "Health & Fitness Disclaimer"],
              ["#s14", "Disclaimer of Warranties"],
              ["#s15", "Limitation of Liability"],
              ["#s16", "Indemnification"],
              ["#s17", "Termination"],
              ["#s18", "Changes to These Terms"],
              ["#s19", "Governing Law"],
              ["#s20", "Contact Information"],
            ].map(([href, label]) => (
              <li key={href} className="text-[15px] text-violet-400 pl-1">
                <a href={href} className="hover:text-violet-300 transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Section 1 */}
        <section id="s1" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 1
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Acceptance of Terms
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            By accessing or using MoveBreak, you confirm that you have read, understood, and agree to these Terms, as well as our{" "}
            <Link href="/movebreak/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">
              Privacy Policy
            </Link>. These Terms constitute a legally binding agreement between you and Hatchling Creative.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We may update these Terms from time to time. Your continued use of the App after any changes constitutes acceptance of the updated Terms. We will make reasonable efforts to notify you of material changes through the App or by other appropriate means.
          </p>
        </section>

        {/* Section 2 */}
        <section id="s2" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 2
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Description of Service
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak is a health and wellness application designed to help desk workers incorporate short, 60-second micro-movements into their workday. The App provides:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>A curated library of exercises and stretches tailored to various locations (desk, car, airplane, home)</li>
            <li>Intelligent movement selection based on your body areas of concern, energy level, and location</li>
            <li>Customizable reminders to move throughout your workday</li>
            <li>Activity tracking including movement streaks, completion history, and daily statistics</li>
            <li>Apple HealthKit integration to log workouts and read stand hour data</li>
            <li>Calendar integration to intelligently pause reminders during meetings</li>
            <li>Personalized notification content adapted to your preferences</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="s3" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 3
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Eligibility
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            You must be at least 13 years of age to use MoveBreak. If you are under the age of 18, you must have the consent of a parent or legal guardian. By using the App, you represent and warrant that you meet these eligibility requirements.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            If you are using MoveBreak on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
          </p>
        </section>

        {/* Section 4 */}
        <section id="s4" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 4
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            User Accounts &amp; Data
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak does not require you to create an account or provide an email address. The App stores your preferences and activity data locally on your device using Apple&apos;s SwiftData framework. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Your first name (used for personalized notifications)</li>
            <li>Work schedule preferences (start time, end time)</li>
            <li>Body area focus preferences</li>
            <li>Movement completion history and streak data</li>
            <li>Favorite movements</li>
            <li>Notification, sound, and haptic preferences</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            All of this data is stored exclusively on your device and is not transmitted to our servers. You are responsible for maintaining the security of your device. If you delete the App, all locally stored data will be permanently removed.
          </p>
        </section>

        {/* Section 5 */}
        <section id="s5" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 5
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Free &amp; Premium Tiers
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak is available in two tiers:
          </p>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 my-5">
            <h3 className="text-base font-semibold text-white mb-3">Free Tier</h3>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed">
              Includes access to 3 exercises per location (desk, car, airplane, home), the movement library in browse mode, Apple HealthKit integration, and basic movement tracking.
            </p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 my-5">
            <h3 className="text-base font-semibold text-white mb-3">Premium Tier</h3>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed">
              Unlocks the full library of 100+ exercises and stretches, personalized smart notifications and reminders, streak tracking and detailed analytics, customizable notification tones and persistence modes, and all future premium features.
            </p>
          </div>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We reserve the right to modify the features included in each tier. If we make changes that materially reduce the functionality of the Premium tier, existing subscribers will continue to receive the features available at the time of their most recent subscription renewal until the end of their current billing period.
          </p>
        </section>

        {/* Section 6 */}
        <section id="s6" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 6
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Subscriptions &amp; Billing
          </h2>
          <div className="bg-violet-400/[0.08] border border-violet-400/20 rounded-xl px-6 py-5 my-5">
            <p className="text-white font-medium">
              All subscriptions are processed through Apple&apos;s App Store and are subject to Apple&apos;s terms and conditions for auto-renewable subscriptions.
            </p>
          </div>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Pricing.</strong> The current subscription price is displayed on the paywall screen within the App and on the App Store product page. Prices may vary by region and are subject to change. Any price changes will take effect at the start of your next billing period, and you will be notified in advance by Apple.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Auto-Renewal.</strong> Your MoveBreak Premium subscription automatically renews unless you cancel it at least 24 hours before the end of the current billing period. Your Apple ID account will be charged for renewal within 24 hours prior to the end of the current period at the rate of the selected plan.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Free Trial.</strong> If offered, a free trial period may be available. If you do not cancel before the free trial ends, your subscription will automatically convert to a paid subscription at the posted rate.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Managing Your Subscription.</strong> You can manage or cancel your subscription at any time through your Apple ID account settings (Settings → [Your Name] → Subscriptions) or through the App Store. Cancellation takes effect at the end of the current billing period.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Refunds.</strong> All purchases are processed by Apple. Refund requests must be submitted to Apple directly through their support channels at{" "}
            <a href="https://reportaproblem.apple.com" className="text-violet-400 hover:text-violet-300 transition-colors">
              reportaproblem.apple.com
            </a>. We do not have the ability to process refunds on Apple&apos;s behalf.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Restore Purchases.</strong> If you reinstall MoveBreak or switch devices, you can restore your active subscription using the &ldquo;Restore Purchases&rdquo; button in the App&apos;s Settings.
          </p>
        </section>

        {/* Section 7 */}
        <section id="s7" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 7
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            HealthKit Integration
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak integrates with Apple HealthKit to enhance your experience. This integration is entirely optional and requires your explicit authorization.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Data We Write.</strong> When you complete a movement, MoveBreak may log it to HealthKit as a &ldquo;Mind and Body&rdquo; workout, including estimated active energy burned (approximately 3 calories per minute), and metadata identifying the movement name, location, and type.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            <strong className="text-white font-semibold">Data We Read.</strong> MoveBreak reads your Apple Stand Hour data to provide context for notifications and activity scoring. No other health data is accessed.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            In accordance with Apple&apos;s HealthKit guidelines, MoveBreak will never use HealthKit data for advertising, share HealthKit data with third parties, or sell HealthKit data under any circumstances. HealthKit data is accessed solely to provide the features described above.
          </p>
        </section>

        {/* Section 8 */}
        <section id="s8" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 8
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Calendar Integration
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak can optionally access your device calendar to intelligently pause reminders during scheduled meetings. This feature requires your explicit permission and can be disabled at any time in Settings.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            When enabled, MoveBreak reads only the start and end times of non-all-day events for the current day and the following day. It does not read event titles, descriptions, attendees, locations, or any other event details. Calendar data is processed locally on your device and is never stored or transmitted.
          </p>
        </section>

        {/* Section 9 */}
        <section id="s9" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 9
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Notifications
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak Premium subscribers may enable personalized movement reminders. Notifications are scheduled locally on your device using Apple&apos;s UserNotifications framework. The content, timing, and frequency of notifications are determined by your settings:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li><strong className="text-white font-semibold">Persistence Modes:</strong> &ldquo;Once&rdquo; (single reminder per interval), &ldquo;A Couple Times&rdquo; (up to 2 follow-ups), or &ldquo;Hound Me&rdquo; (up to 5 follow-ups)</li>
            <li><strong className="text-white font-semibold">Tone Settings:</strong> &ldquo;Motivational&rdquo; (encouraging), &ldquo;Upbuilding&rdquo; (warm and supportive), or &ldquo;Bully&rdquo; (firm and demanding)</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            You can adjust these settings or disable notifications entirely at any time. No notification data is sent to external servers.
          </p>
        </section>

        {/* Section 10 */}
        <section id="s10" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 10
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            On-Device AI Features
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            On supported devices running iOS 26 or later, MoveBreak may use Apple&apos;s on-device Foundation Models framework to generate personalized notification messages. This processing occurs entirely on your device using Apple&apos;s system language model.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            No personal data is sent to any server — including Hatchling Creative&apos;s or Apple&apos;s — for AI processing. On devices that do not support on-device AI, the App uses a curated library of pre-written messages as a fallback.
          </p>
        </section>

        {/* Section 11 */}
        <section id="s11" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 11
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Acceptable Use
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the App</li>
            <li>Modify, adapt, translate, or create derivative works based on the App</li>
            <li>Circumvent, disable, or interfere with any security, licensing, or access-control features of the App, including subscription verification</li>
            <li>Use the App for any unlawful purpose or in violation of any applicable laws or regulations</li>
            <li>Distribute, sublicense, rent, lease, or lend the App to third parties</li>
            <li>Remove, alter, or obscure any proprietary notices, labels, or marks in the App</li>
          </ul>
        </section>

        {/* Section 12 */}
        <section id="s12" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 12
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Intellectual Property
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            All content, features, and functionality of MoveBreak — including but not limited to the exercise library, movement instructions, user interface design, graphics, animations, text, and software code — are owned by Hatchling Creative and are protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            The exercise instructions in MoveBreak are informed by established health organization guidelines, including NASA&apos;s DeskFit program. The specific presentation, arrangement, and curated selection of movements are original works of Hatchling Creative.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            You are granted a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes in accordance with these Terms.
          </p>
        </section>

        {/* Section 13 */}
        <section id="s13" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 13
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Health &amp; Fitness Disclaimer
          </h2>
          <div className="bg-violet-400/[0.08] border border-violet-400/20 rounded-xl px-6 py-5 my-5">
            <p className="text-white font-medium">
              MoveBreak is a wellness tool, not a medical device. The App does not provide medical advice, diagnose conditions, or prescribe treatments.
            </p>
          </div>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            The exercises and stretches provided through MoveBreak are designed to be low-intensity, short-duration movements suitable for general adult populations. However, you should:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-white/70 text-[15px]">
            <li>Consult your physician or healthcare provider before beginning any exercise program, particularly if you have pre-existing medical conditions, injuries, or physical limitations</li>
            <li>Stop any movement immediately if you experience pain, dizziness, shortness of breath, or discomfort</li>
            <li>Use your own judgment regarding the suitability of any exercise for your physical condition</li>
            <li>Not rely on MoveBreak as a substitute for professional medical advice, diagnosis, or treatment</li>
          </ul>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4 mt-4">
            Hatchling Creative is not responsible for any injuries, health complications, or other adverse effects that may result from performing movements suggested by the App. You assume all risk associated with your use of the App&apos;s exercise content.
          </p>
        </section>

        {/* Section 14 */}
        <section id="s14" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 14
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Disclaimer of Warranties
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            MoveBreak is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, either express or implied. To the fullest extent permitted by applicable law, Hatchling Creative disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and accuracy.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We do not warrant that the App will be uninterrupted, error-free, secure, or free of harmful components. We do not warrant that any results obtained from the use of the App will be accurate or reliable.
          </p>
        </section>

        {/* Section 15 */}
        <section id="s15" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 15
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Limitation of Liability
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            To the maximum extent permitted by applicable law, in no event shall Hatchling Creative, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, personal injury, or property damage, arising out of or in connection with your use of or inability to use the App.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            In no event shall our total aggregate liability exceed the amount you have paid to us in the twelve (12) months immediately preceding the event giving rise to the claim, or fifty U.S. dollars ($50), whichever is greater.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            Some jurisdictions do not allow the limitation or exclusion of liability for certain types of damages. In such jurisdictions, our liability shall be limited to the greatest extent permitted by law.
          </p>
        </section>

        {/* Section 16 */}
        <section id="s16" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 16
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Indemnification
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            You agree to indemnify, defend, and hold harmless Hatchling Creative and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys&apos; fees) arising out of or in any way connected with your use of the App, your violation of these Terms, or your violation of any rights of a third party.
          </p>
        </section>

        {/* Section 17 */}
        <section id="s17" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 17
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Termination
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We may suspend or terminate your access to MoveBreak at any time, with or without cause, and with or without notice. Upon termination, your right to use the App ceases immediately.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            You may terminate your use of the App at any time by deleting it from your device. If you have an active subscription, you must also cancel it through your Apple ID account settings to avoid future charges.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            Sections that by their nature should survive termination — including Disclaimer of Warranties, Limitation of Liability, Indemnification, and Governing Law — shall survive any termination of these Terms.
          </p>
        </section>

        {/* Section 18 */}
        <section id="s18" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 18
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Changes to These Terms
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We reserve the right to modify these Terms at any time. If we make material changes, we will provide notice through the App, by updating the &ldquo;Effective&rdquo; date at the top of this page, or by other reasonable means. Your continued use of MoveBreak after the revised Terms become effective constitutes your acceptance of the changes.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            We encourage you to review these Terms periodically for updates.
          </p>
        </section>

        {/* Section 19 */}
        <section id="s19" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 19
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Governing Law
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the State of Utah, United States, without regard to its conflict of laws provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Utah.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.
          </p>
        </section>

        {/* Section 20 */}
        <section id="s20" className="mb-9">
          <div className="text-[12px] font-bold text-violet-400 tracking-[1.5px] uppercase mb-2">
            Section 20
          </div>
          <h2 className="font-serif text-xl font-bold text-white mt-0 mb-4">
            Contact Information
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-4">
            If you have questions about these Terms, please contact us:
          </p>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 my-5">
            <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-2">
              <strong className="text-white font-semibold">Hatchling Creative</strong>
            </p>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-2">
              Email:{" "}
              <a href="mailto:support@hatchlingcreative.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                support@hatchlingcreative.com
              </a>
            </p>
            <p className="font-sans text-[15px] text-white/70 leading-relaxed">
              Web:{" "}
              <a href="https://hatchlingcreative.com" className="text-violet-400 hover:text-violet-300 transition-colors">
                hatchlingcreative.com
              </a>
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center px-6 py-10 border-t border-white/10">
        <p className="text-[13px] text-white/40 mb-2">&copy; 2026 Hatchling Creative. All rights reserved.</p>
        <p className="text-[13px] text-white/40">
          <Link href="/movebreak/privacy" className="text-violet-400 hover:text-violet-300 transition-colors">Privacy Policy</Link>
          {" · "}
          <Link href="/movebreak/terms" className="text-violet-400 hover:text-violet-300 transition-colors">Terms of Use</Link>
        </p>
      </footer>
    </div>
  );
}
