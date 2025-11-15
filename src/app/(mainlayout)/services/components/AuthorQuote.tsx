// src/app/(mainlayout)/services/components/AuthorQuote.tsx
import Image from 'next/image';

interface AuthorQuoteProps {
  author: string;
  authorQuote: string;
}

const AuthorQuote = ({ author, authorQuote }: AuthorQuoteProps) => {
  // Only render if there's an author quote
  if (!authorQuote || authorQuote.trim() === "") {
    return null;
  }

  return (
    <section className="bg-primary/5 rounded-lg border border-primary/20 p-6 my-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center overflow-hidden">
            <Image 
              src="/Expert-Full-Stack-Web-Applications-Developer-in-Bangladesh-Md-Imran-Hossen-Jia-Pixel.png" 
              alt="Md Imran Hossen" 
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">From the Author</h3>
          <blockquote className="text-foreground italic">
            &quot;{authorQuote}&quot;
          </blockquote>
          <div className="mt-4 text-sm text-muted-foreground">
            — {author || "Service Author"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorQuote;