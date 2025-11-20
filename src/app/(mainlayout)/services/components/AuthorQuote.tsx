// src/app/(mainlayout)/services/components/AuthorQuote.tsx
import Image from 'next/image';

interface AuthorQuoteProps {
  author: string;
  authorQuote: string;
}

const AuthorQuote = ({ author, authorQuote }: AuthorQuoteProps) => {
  if (!authorQuote?.trim()) return null;

  return (
    <section className="my-12 max-w-3xl mx-auto">
      <div className="relative  rounded-2xl border-l-4 border-primary p-8 shadow-sm">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-full" />
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6 relative z-10">
          {/* Author Avatar */}
          <div className="shrink-0 flex items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute -inset-2 bg-primary/10 rounded-full animate-pulse"></div>
              <Image 
                src="/Expert-Full-Stack-Web-Applications-Developer-in-Bangladesh-Md-Imran-Hossen-Jia-Pixel.png" 
                alt="Md Imran Hossen"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-white relative z-10 shadow-md"
              />
            </div>
            <div className="lg:hidden">
              <div className="font-semibold text-foreground">{author}</div>
              <div className="text-sm text-muted-foreground">Expert Developer</div>
            </div>
          </div>

          {/* Quote Content */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <svg className="w-6 h-6 text-primary shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
              <blockquote className="text-foreground text-lg leading-relaxed italic">
                {authorQuote}
              </blockquote>
            </div>
            
            {/* Author info for desktop */}
            <p className="items-center gap-2 text-sm text-muted-foreground border-t border-gray-100 pt-4">
              <span className="font-semibold text-foreground">{author}</span> 
              <br/>
              <span className="text-sm italic text-muted-foreground">CEO, Jia Pixel</span>
            
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorQuote;