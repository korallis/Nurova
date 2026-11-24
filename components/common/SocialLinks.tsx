import type { SettingsContent } from '@/lib/content/pages';
import { cn } from '@/lib/utils';

export const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', icon: '/graphics/icons/linkedin.svg' },
  { key: 'instagram', label: 'Instagram', icon: '/graphics/icons/instagram.svg' },
  { key: 'facebook', label: 'Facebook', icon: '/graphics/icons/facebook.svg' },
] as const;

/** One white social icon; only a link once its URL is set in Site settings. */
export function SocialIcon({
  href,
  label,
  icon,
  className,
}: {
  href: string;
  label: string;
  icon: string;
  className?: string;
}) {
  const motionClass = 'block rounded-full transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:-rotate-6';
  // eslint-disable-next-line @next/next/no-img-element
  const image = <img src={icon} alt="" width={38} height={38} className={cn('h-[38px] w-[38px]', className)} />;
  return href ? (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(motionClass, 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent')}
    >
      {image}
    </a>
  ) : (
    <span aria-hidden="true" className={motionClass}>
      {image}
    </span>
  );
}

/** The LinkedIn, Instagram and Facebook icons in a row. */
export function SocialLinks({ socials, className, iconClassName }: { socials: SettingsContent['socials']; className?: string; iconClassName?: string }) {
  return (
    <div className={cn('flex items-center gap-[17px]', className)}>
      {SOCIALS.map(({ key, label, icon }) => (
        <SocialIcon key={key} href={socials[key]} label={label} icon={icon} className={iconClassName} />
      ))}
    </div>
  );
}
