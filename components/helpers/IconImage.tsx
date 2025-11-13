
export default function IconImg({ url, alt = 'icon', className = '' }: { url: string; alt?: string; className?: string }) {
  return <img src={url} alt={alt} className={`w-6 h-6 ${className}`} />;
}