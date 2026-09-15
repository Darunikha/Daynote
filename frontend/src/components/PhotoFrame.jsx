import { PinCharm, WashiTapeCharm } from './Charms';

/**
 * Wraps a journal photo in the chosen scrapbook presentation. Reuses the
 * same pin/tape illustrations as the entry-decoration charms so a "pinned"
 * or "taped" photo feels like part of the same physical page.
 */
export default function PhotoFrame({ src, alt = '', style = 'plain', className = '', imgClassName = '' }) {
  if (!src) return null;

  if (style === 'polaroid') {
    return (
      <div className={`inline-block w-full rotate-[-1.5deg] rounded-sm bg-white p-3 pb-8 shadow-paper-lg ${className}`}>
        <img src={src} alt={alt} className={`block w-full rounded-[2px] object-cover ${imgClassName}`} />
      </div>
    );
  }

  if (style === 'pinned') {
    return (
      <div className={`relative inline-block w-full rotate-[1deg] ${className}`}>
        <span className="absolute -top-4 left-1/2 z-[1] -translate-x-1/2" style={{ width: 22, height: 26 }}>
          <PinCharm className="h-full w-full" />
        </span>
        <img src={src} alt={alt} className={`block w-full rounded-xl object-cover shadow-paper-lg ${imgClassName}`} />
      </div>
    );
  }

  if (style === 'taped') {
    return (
      <div className={`relative inline-block w-full rotate-[-1deg] ${className}`}>
        <span className="absolute -top-3 left-4 z-[1] -rotate-[14deg]" style={{ width: 50, height: 20 }}>
          <WashiTapeCharm className="h-full w-full" />
        </span>
        <span className="absolute -top-3 right-4 z-[1] rotate-[14deg]" style={{ width: 50, height: 20 }}>
          <WashiTapeCharm className="h-full w-full" color="#B9C6DE" colorDark="#9AACC9" />
        </span>
        <img src={src} alt={alt} className={`block w-full rounded-xl object-cover shadow-paper ${imgClassName}`} />
      </div>
    );
  }

  if (style === 'framed') {
    return (
      <div
        className={`inline-block w-full rounded-sm p-2.5 shadow-paper-lg ${className}`}
        style={{ backgroundColor: '#FBF7EF', boxShadow: 'inset 0 0 0 1px rgb(var(--border))' }}
      >
        <div className="rounded-[2px] p-1" style={{ boxShadow: 'inset 0 0 0 1px rgb(var(--border) / 0.6)' }}>
          <img src={src} alt={alt} className={`block w-full rounded-[1px] object-cover ${imgClassName}`} />
        </div>
      </div>
    );
  }

  return <img src={src} alt={alt} className={`block w-full rounded-xl object-cover ${className} ${imgClassName}`} />;
}
