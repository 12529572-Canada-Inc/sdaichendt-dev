export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
        <p>
          © {year} Shawn Daichendt — built with Next.js & Tailwind
        </p>
        <a
          href="https://github.com/djedi-knight"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          github.com/djedi-knight
        </a>
      </div>
    </footer>
  );
}
