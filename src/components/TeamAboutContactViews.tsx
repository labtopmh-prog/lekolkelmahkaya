import React, { useState } from 'react';
import { CheckCircle2, Mail, Send, Shield, Smartphone, Sparkles } from 'lucide-react';
import type { TeamMember } from '../types/library';
import { LIBRARY_MEDIA } from '../data/seedData';
import { validateContactInput } from '../utils/libraryLogic';
import { submitContactMessage } from '../services/libraryService';
import { EditorialImage } from './EditorialImage';
import { LibraryButton } from './LibraryButton';

export const TeamView: React.FC<{ team: TeamMember[] }> = ({ team }) => {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 space-y-12 animate-gentle-reveal">
      <div className="border-b border-[var(--border-hairline)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
            التعريف بفريق المكتبة
          </p>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
            فريق كل كلمة حكاية
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
          يعمل فريق المكتبة بروحٍ واحدة في تقديم المحتوى الأدبي، مع وضوح كامل في الأدوار والمسؤوليات الإدارية.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <article
            key={member.id}
            style={{ animationDelay: `${index * 70}ms` }}
            className="animate-gentle-reveal rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-7 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 shadow-xs"
          >
            <div>
              <div className="flex items-center gap-4">
                <div
                  className="p-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: member.accentTone }}
                >
                  <EditorialImage
                    src={member.portraitUrl}
                    alt={member.name}
                    fallbackTitle={member.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
                    {member.name}
                  </h2>
                  <p className="text-xs font-medium text-[var(--accent-primary)] mt-1">
                    {member.roleTitle}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {member.bio}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-hairline)] text-xs text-[var(--text-muted)]">
              {member.roleLevel === 'super_admin'
                ? 'صلاحية الإدارة العليا والتحكم الكامل'
                : member.roleLevel === 'chief_assistant'
                  ? 'تنسيق التحرير ومتابعة أقسام المكتبة'
                  : 'صلاحية مساعدة في المحتوى وتنسيق القراءة'}
            </div>
          </article>
        ))}
      </div>

      {/* Governance Clarity Note */}
      <div className="rounded-2xl bg-[var(--bg-surface-soft)]/80 border border-[var(--border-hairline)] p-6 flex items-start gap-4">
        <Shield className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          تجمعنا روح الفريق في المشهد التقديمي وخدمة القرّاء، مع الحفاظ على هيكل صلاحيات دقيق: تظل الأستاذة <strong>ملك أحمد سامي</strong> هي مؤسسة المكتبة والمديرة العليا صاحبة الصلاحيات الكاملة، بينما يعمل المساعد الرئيسي والمساعدون بصلاحيات تحريرية محددة ومنظمة.
        </p>
      </div>
    </div>
  );
};

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 space-y-14 animate-gentle-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <p className="text-xs font-medium text-[var(--accent-primary)] mb-2">
            رؤيتنا وهويتنا
          </p>
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            عن منصة «كل كلمة حكاية»
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)]">
            وُلدت «كل كلمة حكاية» من قناعةٍ بسيطة: أن القراءة تجربة وجدانية وجمالية قبل أن تكون تصفحًا رقميًا. لذلك صُمّمت المكتبة بألوان فاتحة مستوحاة من الورق الكريمي، وأزهار الصباح، والضوء الهادئ.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
            تعمل المنصة بهوية موحدة وقاعدة بيانات سحابية مشتركة بين موقع الويب وتطبيقات الهاتف على Android وiOS؛ لتبقى كتبك المفضلة وتقدمك في القراءة وسمتك المختارة معك في كل مكان.
          </p>
        </div>
        <div className="lg:col-span-6">
          <div className="h-full min-h-[280px] rounded-3xl overflow-hidden border border-[var(--border-hairline)]">
            <EditorialImage
              src={LIBRARY_MEDIA.exterior}
              alt="حديقة مكتبة كل كلمة حكاية"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6">
          <Sparkles className="w-5 h-5 text-[var(--accent-primary)] mb-3 icon-float" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            هوية بصرية مريحة للعين
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            ست سمات فاتحة ناعمة (الكريمي، الوردي، اللافندر، السماوي، النعناعي، والخوخي) بدون أي خلفيات داكنة مجهدة.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6">
          <Smartphone className="w-5 h-5 text-[var(--accent-primary)] mb-3 icon-float" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            ويب وتطبيق Android و iOS
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            يدعم التثبيت المباشر كـ PWA إلى جانب مشروع Capacitor مهيّأ للبناء والتوزيع على متاجر الهواتف.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6">
          <Shield className="w-5 h-5 text-[var(--accent-primary)] mb-3 icon-float" aria-hidden="true" />
          <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
            مزامنة وصلاحيات منضبطة
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            إضافة أي كتاب أو اقتباس من الويب تنعكس فورًا في تطبيق الهاتف مع حماية صارمة للبيانات والصلاحيات.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);

    const validation = validateContactInput({ name, email, subject, message });
    setErrors(validation.errors);
    if (!validation.valid) return;

    setSubmitting(true);
    try {
      await submitContactMessage({ name, email, subject, message });
      setSubmitSuccess('وصلت رسالتك إلى فريق «كل كلمة حكاية» بنجاح. شكرًا لتواصلك الدافئ.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setErrors({});
    } catch {
      setSubmitError('تعذّر إرسال الرسالة حاليًا. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-10 space-y-8 animate-gentle-reveal">
      <div className="border-b border-[var(--border-hairline)] pb-6">
        <p className="text-xs font-medium text-[var(--accent-primary)] mb-1">
          نستقبل اقتراحاتكم ومشاركاتكم
        </p>
        <h1 className="font-editorial text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
          تواصل معنا
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6">
            <Mail className="w-5 h-5 text-[var(--accent-primary)] mb-3 icon-float" aria-hidden="true" />
            <h2 className="font-editorial text-2xl font-bold text-[var(--text-primary)]">
              رسالة إلى فريق المكتبة
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              هل لديك كتاب تقترحه للإضافة، أو خاطرة تود مشاركتها في قسم «كلمات تلمس القلب»، أو ملاحظة حول تطبيق الهاتف؟ أرسلها مباشرة لتصل إلى لوحة مراجعة الفريق.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] p-6 md:p-8 space-y-5 shadow-xs"
        >
          {submitSuccess && (
            <div
              role="status"
              className="rounded-xl bg-[#EAF6F0] border border-[#3F7E61]/30 p-4 text-sm text-[#24553F] flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {submitError && (
            <div
              role="alert"
              className="rounded-xl bg-[#FDF2F2] border border-[#9E3B3B]/30 p-4 text-sm text-[#7D2C2C]"
            >
              {submitError}
            </div>
          )}

          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              الاسم الكامل
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك"
              className="w-full min-h-[44px] px-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-2 focus:outline-[var(--accent-primary)]"
            />
            {errors.name && <p className="mt-1 text-xs text-[#9E3B3B]">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              البريد الإلكتروني
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full min-h-[44px] px-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-2 focus:outline-[var(--accent-primary)]"
            />
            {errors.email && <p className="mt-1 text-xs text-[#9E3B3B]">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              موضوع الرسالة
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="اقتراح كتاب أو استفسار"
              className="w-full min-h-[44px] px-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-2 focus:outline-[var(--accent-primary)]"
            />
            {errors.subject && <p className="mt-1 text-xs text-[#9E3B3B]">{errors.subject}</p>}
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              نص الرسالة
            </label>
            <textarea
              id="contact-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="w-full p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] focus:outline-2 focus:outline-[var(--accent-primary)]"
            />
            {errors.message && <p className="mt-1 text-xs text-[#9E3B3B]">{errors.message}</p>}
          </div>

          <LibraryButton
            type="submit"
            variant="primary"
            size="md"
            loading={submitting}
            icon={<Send className="w-4 h-4" aria-hidden="true" />}
          >
            إرسال الرسالة
          </LibraryButton>
        </form>
      </div>
    </div>
  );
};
