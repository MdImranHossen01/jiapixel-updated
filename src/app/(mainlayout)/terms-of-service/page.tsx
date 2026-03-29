// G:\jiapixel-updated\src\app\(mainlayout)\terms-of-service\page.tsx
import { Metadata } from 'next';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'পরিষেবার শর্তাবলী | JIA Pixel - ডিজিটাল এজেন্সি',
  description: 'জিয়া পিক্সেল (JIA Pixel) এর পরিষেবার শর্তাবলী পড়ুন। আমাদের ওয়েবসাইটের ব্যবহার, পরিষেবা, বুদ্ধিবৃত্তিক সম্পদ, পেমেন্ট এবং ক্লায়েন্ট চুক্তির নীতিমালা সম্পর্কে জানুন।',
  keywords: 'terms of service, পরিষেবার শর্তাবলী, আইনী চুক্তি, ডিজিটাল এজেন্সি শর্তাবলী, ওয়েব ডিজাইন শর্তাবলী, ডেভেলপমেন্ট চুক্তি',

  // Open Graph
  openGraph: {
    title: 'পরিষেবার শর্তাবলী | JIA Pixel',
    description: 'জিয়া পিক্সেল ডিজিটাল এজেন্সি পরিষেবার জন্য আইনী শর্তাবলী এবং নিয়মাবলী',
    type: 'website',
    url: 'https://www.jiapixel.com/terms-of-service',
    siteName: 'JIA Pixel',
    locale: 'bn_BD',
    images: [
      {
        url: '/og-terms.jpg',
        width: 1200,
        height: 630,
        alt: 'JIA Pixel পরিষেবার শর্তাবলী',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'পরিষেবার শর্তাবলী | JIA Pixel',
    description: 'জিয়া পিক্সেল ডিজিটাল এজেন্সি পরিষেবার জন্য আইনী শর্তাবলী এবং নিয়মাবলী',
    images: ['/og-terms.jpg'],
  },

  // Canonical
  alternates: {
    canonical: 'https://www.jiapixel.com/terms-of-service',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Additional Meta
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console code
  },
};

// Add structured data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'পরিষেবার শর্তাবলী',
  description: 'জিয়া পিক্সেল ডিজিটাল এজেন্সির পরিষেবার শর্তাবলী',
  url: 'https://www.jiapixel.com/terms-of-service',
  publisher: {
    '@type': 'Organization',
    name: 'JIA Pixel',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.jiapixel.com/logo.png',
    },
  },
};

const TermsOfServicePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/<\/script>/gi, '<\\/script>') }}
      />
      <div className="min-h-screen py-20 font-bengali">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">পরিষেবার শর্তাবলী</h1>
            <p className="text-xl text-muted-foreground">
              সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">

                {/* Introduction */}
                <section className="mb-12">
                  <p className="text-lg leading-relaxed">
                    জিয়া পিক্সেলে (JIA Pixel) আপনাকে স্বাগতম। এই পরিষেবার শর্তাবলী আমাদের ওয়েবসাইট এবং পরিষেবা ব্যবহারের নিয়মাবলী নির্ধারণ করে। আমাদের ওয়েবসাইট অ্যাক্সেস বা আমাদের পরিষেবা ব্যবহারের মাধ্যমে আপনি এই শর্তাবলির সাথে একমত পোষণ করছেন।
                  </p>
                </section>

                {/* Services Description */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">১. পরিষেবার সংক্ষিপ্ত বিবরণ</h2>
                  <p className="mb-4">
                    জিয়া পিক্সেল ডিজিটাল ডিজাইন এবং ডেভেলপমেন্ট পরিষেবা প্রদান করে যার মধ্যে অন্তর্ভুক্ত (তবে সীমাবদ্ধ নয়):
                  </p>
                  <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                    <li>ওয়েবসাইট ডিজাইন এবং ডেভেলপমেন্ট</li>
                    <li>ইউআই/ইউএক্স (UI/UX) ডিজাইন পরিষেবা</li>
                    <li>ব্র্যান্ড আইডেন্টিটি ডিজাইন</li>
                    <li>ডিজিটাল মার্কেটিং পরিষেবা</li>
                    <li>পরামর্শ এবং কৌশলগত পরিষেবা</li>
                  </ul>
                </section>

                {/* User Responsibilities */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">২. ব্যবহারকারীর দায়িত্ব</h2>
                  <p className="mb-4">আমাদের পরিষেবা ব্যবহারের সময় আপনি নিম্নলিখিত বিষয়গুলোতে সম্মত হচ্ছেন:</p>
                  <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                    <li>সঠিক এবং সম্পূর্ণ তথ্য প্রদান করা</li>
                    <li>আপনার অ্যাকাউন্টের গোপনীয়তা বজায় রাখা</li>
                    <li>কোনো অবৈধ বা অননুমোদিত উদ্দেশ্যে আমাদের পরিষেবা ব্যবহার না করা</li>
                    <li>পরিষেবা বা সার্ভারে কোনো ধরনের হস্তক্ষেপ বা বিঘ্ন সৃষ্টি না করা</li>
                    <li>সমস্ত প্রযোজ্য আইন এবং নিয়মাবলী মেনে চলা</li>
                  </ul>
                </section>

                {/* Intellectual Property */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">৩. বুদ্ধিবৃত্তিক সম্পদ</h2>
                  <p className="mb-4">
                    আমাদের ওয়েবসাইটের সমস্ত বিষয়বস্তু, বৈশিষ্ট্য এবং কার্যকারিতা, যার মধ্যে রয়েছে টেক্সট, গ্রাফিক্স, লোগো এবং সফটওয়্যার, জিয়া পিক্সেলের একচেটিয়া সম্পত্তি এবং এগুলো আন্তর্জাতিক কপিরাইট, ট্রেডমার্ক এবং অন্যান্য বুদ্ধিবৃত্তিক সম্পত্তি আইন দ্বারা সুরক্ষিত।
                  </p>
                  <p className="mb-4">
                    সম্পূর্ণ পেমেন্টের পর, ক্লায়েন্টরা চূড়ান্ত কাজের মালিকানা লাভ করেন, তবে জিয়া পিক্সেল আমাদের পোর্টফোলিও এবং মার্কেটিং উপকরণে সেই কাজ প্রদর্শনের অধিকার সংরক্ষণ করে।
                  </p>
                </section>

                {/* Payments and Refunds */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">৪. পেমেন্ট এবং রিফান্ড</h2>
                  <p className="mb-4">
                    <strong>পেমেন্ট শর্তাবলী:</strong> কাজ শুরু করার জন্য প্রকল্পের ৫০% ডিপোজিট প্রয়োজন, যদি না লিখিতভাবে অন্য কোনো চুক্তি থাকে।
                  </p>
                  <p className="mb-4">
                    <strong>রিফান্ড পলিসি:</strong> কাজ শুরু হয়ে গেলে ডিপোজিট অফেরতযোগ্য। কাজ শুরুর পর প্রকল্প বাতিল হলে, বাতিল হওয়ার তারিখ পর্যন্ত সম্পন্ন কাজের জন্য ক্লায়েন্টকে বিল প্রদান করতে হবে।
                  </p>
                  <p className="mb-4">
                    <strong>বকেয়া পেমেন্ট:</strong> ৩০ দিনের বেশি বকেয়া থাকলে লেট ফি এবং পরিষেবা স্থগিত করা হতে পারে।
                  </p>
                </section>

                {/* Project Timelines */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">৫. প্রকল্পের সময়সীমা</h2>
                  <p className="mb-4">
                    প্রকল্পের সময়সীমা সম্ভাব্য সময়কাল এবং এটি ক্লায়েন্টের প্রতিক্রিয়া, স্কোপ পরিবর্তন এবং অন্যান্য কারণের ওপর নির্ভর করে। জিয়া পিক্সেল নির্দিষ্ট সময়সীমায় কাজ শেষ করার সর্বোচ্চ চেষ্টা করবে তবে সুনির্দিষ্ট সমাপ্তির তারিখের গ্যারান্টি দেয় না।
                  </p>
                </section>

                {/* Client Content */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">৬. ক্লায়েন্টের বিষয়বস্তু</h2>
                  <p className="mb-4">
                    প্রয়োজনীয় সমস্ত বিষয়বস্তু, ছবি এবং উপকরণ সময়মতো প্রদানের জন্য ক্লায়েন্ট দায়ী। বিলম্বিত উপকরণের কারণে প্রজেক্ট ডেলিভারিতে বিলম্বের জন্য জিয়া পিক্সেল দায়ী থাকবে না।
                  </p>
                  <p className="mb-4">
                    ক্লায়েন্টদের অবশ্যই নিশ্চিত করতে হবে যে জিয়া পিক্সেলকে দেওয়া সমস্ত উপকরণের যথাযথ অধিকার এবং অনুমতি তাদের রয়েছে।
                  </p>
                </section>

                {/* Revisions */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">৭. সংশোধন এবং পরিবর্তন</h2>
                  <p className="mb-4">
                    প্রস্তাব অনুযায়ী প্রতিটি প্রকল্পে নির্দিষ্ট সংখ্যক রিভিশন রাউন্ড অন্তর্ভুক্ত। অতিরিক্ত রিভিশনের জন্য অতিরিক্ত চার্জ প্রযোজ্য হতে পারে।
                  </p>
                  <p className="mb-4">
                    কাজ শুরুর পর প্রকল্পের মূল স্কোপে উল্লেখযোগ্য পরিবর্তন হলে নতুন প্রস্তাব এবং সংশোধিত মূল্যের প্রয়োজন হতে পারে।
                  </p>
                </section>

                {/* Termination */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">৮. সমাপ্তি</h2>
                  <p className="mb-4">
                    যেকোনো পক্ষ লিখিত নোটিশের মাধ্যমে প্রকল্প সমাপ্ত করতে পারে। সমাপ্তির ক্ষেত্রে, ক্লায়েন্ট সমাপ্তির তারিখ পর্যন্ত সম্পন্ন সমস্ত কাজের জন্য পেমেন্ট প্রদান করতে বাধ্য থাকবেন।
                  </p>
                </section>

                {/* Limitation of Liability */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">৯. দায়ের সীমাবদ্ধতা</h2>
                  <p className="mb-4">
                    যেকোনো দাবির জন্য জিয়া পিক্সেলের মোট দায়বদ্ধতা নির্দিষ্ট প্রকল্পের জন্য ক্লায়েন্টের প্রদান করা মোট অর্থের বেশি হবে না।
                  </p>
                  <p className="mb-4">
                    আমাদের পরিষেবা ব্যবহারের ফলে কোনো পরোক্ষ বা বিশেষ ক্ষতির জন্য জিয়া পিক্সেল দায়ী থাকবে না।
                  </p>
                </section>

                {/* Indemnification */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">১০. ক্ষতিপূরণ</h2>
                  <p className="mb-4">
                    আপনি জিয়া পিক্সেল এবং এর কর্মচারীদের যেকোনো দাবি বা খরচ থেকে ক্ষতিমুক্ত রাখতে সম্মত হচ্ছেন যা আপনার পরিষেবা ব্যবহার বা এই শর্তাবলী লঙ্ঘনের কারণে উদ্ভূত হয়।
                  </p>
                </section>

                {/* Governing Law */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">১১. পরিচালনা আইন</h2>
                  <p className="mb-4">
                    এই শর্তাবলী বাংলাদেশের আইন বা প্রযোজ্য এখতিয়ারের আইন দ্বারা পরিচালিত এবং ব্যাখ্যা করা হবে।
                  </p>
                </section>

                {/* Changes to Terms */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">১২. শর্তাবলীর পরিবর্তন</h2>
                  <p className="mb-4">
                    আমরা যেকোনো সময় এই শর্তাবলী সংশোধন করার অধিকার সংরক্ষণ করি। আমরা এই পেজে নতুন শর্তাবলী পোস্ট করে এবং সর্বশেষ আপডেটের তারিখ পরিবর্তন করে ব্যবহারকারীদের অবহিত করব।
                  </p>
                </section>

                {/* Contact Information */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">১৩. যোগাযোগের তথ্য</h2>
                  <p className="mb-4">
                    এই পরিষেবার শর্তাবলী সম্পর্কে আপনার কোনো প্রশ্ন থাকলে, দয়া করে আমাদের সাথে যোগাযোগ করুন:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="mb-2"><strong>ইমেইল:</strong> mail.jiapixel@gmail.com</p>
                    <p className="mb-2"><strong>ঠিকানা:</strong> নবকলশ, মতলব দক্ষিণ, চাঁদপুর</p>
                    <p><strong>ফোন:</strong> +৮৮০১৭১৯০১১১০১</p>
                  </div>
                </section>

                {/* Acceptance */}
                <section>
                  <h2 className="text-2xl font-bold mb-6">১৪. শর্তাবলীর স্বীকৃতি</h2>
                  <p className="mb-4">
                    আমাদের ওয়েবসাইট এবং পরিষেবা ব্যবহারের মাধ্যমে আপনি এই শর্তাবলীর প্রতি আপনার স্বীকৃতি প্রদান করছেন। আপনি যদি এই শর্তাবলীতে সম্মত না হন, তবে দয়া করে আমাদের পরিষেবা ব্যবহার করবেন না।
                  </p>
                  <p>
                    শর্তাবলীতে পরিবর্তনের পর আপনার ওয়েবসাইটের ক্রমাগত ব্যবহার সেই পরিবর্তনের স্বীকৃতি হিসেবে গণ্য হবে।
                  </p>
                </section>

              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center mt-12 text-muted-foreground">
            <p>
              এই নথিটি আমাদের পরিষেবা ব্যবহারের ক্ষেত্রে আপনার এবং জিয়া পিক্সেলের মধ্যে সম্পূর্ণ চুক্তি গঠন করে।
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;