// G:\jiapixel-updated\src\app\(mainlayout)\privacy-policy\page.tsx
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, User, Database, Lock, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'গোপনীয়তা নীতি',
  description: 'জিয়া পিক্সেল (JIA Pixel) এর গোপনীয়তা নীতি পড়ুন। জানুন কীভাবে আমরা আপনার ব্যক্তিগত তথ্য সংগ্রহ করি, ব্যবহার করি এবং সুরক্ষা প্রদান করি। আপনার গোপনীয়তা এবং ডাটা নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার।',
  keywords: 'privacy policy, গোপনীয়তা নীতি, ডাটা সুরক্ষা, GDPR, ব্যক্তিগত তথ্য, ডিজিটাল এজেন্সি গোপনীয়তা নীতি, ডাটা নিরাপত্তা',

  openGraph: {
    title: 'গোপনীয়তা নীতি | JIA Pixel',
    description: 'জানুন কীভাবে জিয়া পিক্সেল আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং রক্ষা করে',
    type: 'website',
    url: 'https://www.jiapixel.com/privacy-policy',
    siteName: 'JIA Pixel',
    images: [
      {
        url: '/og-privacy.jpg',
        width: 1200,
        height: 630,
        alt: 'JIA Pixel গোপনীয়তা নীতি',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'গোপনীয়তা নীতি | JIA Pixel',
    description: 'জানুন কীভাবে জিয়া পিক্সেল আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং রক্ষা করে',
    images: ['/og-privacy.jpg'],
  },

  alternates: {
    canonical: 'https://www.jiapixel.com/privacy-policy',
  },

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
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'গোপনীয়তা নীতি',
  description: 'জিয়া পিক্সেল (JIA Pixel) ডিজিটাল এজেন্সির গোপনীয়তা নীতি',
  url: 'https://www.jiapixel.com/privacy-policy',
  publisher: {
    '@type': 'Organization',
    name: 'JIA Pixel',
  },
};

const PrivacyPolicyPage = () => {
  const dataCollectionPoints = [
    {
      icon: <User className="w-5 h-5" />,
      point: 'যোগাযোগ ফর্ম এবং ইনকয়ারি সাবমিশন',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      point: 'ওয়েবসাইট ব্যবহারের বিশ্লেষণ এবং কুকিজ',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      point: 'ইমেল যোগাযোগ এবং নিউজলেটার',
    },
    {
      icon: <Database className="w-5 h-5" />,
      point: 'প্রজেক্ট ম্যানেজমেন্ট এবং ক্লায়েন্ট পোর্টাল',
    },
  ];

  const dataRights = [
    'আপনার ব্যক্তিগত তথ্য অ্যাক্সেস করার অধিকার',
    'ভুল তথ্য সংশোধনের অধিকার',
    'ডাটা মুছে ফেলার অনুরোধের অধিকার',
    'প্রক্রিয়াকরণ সীমাবদ্ধ করার অধিকার',
    'ডাটা পোর্টবিলিটির অধিকার',
    'প্রক্রিয়াকরণে আপত্তির অধিকার',
  ];

  const securityMeasures = [
    'এনক্রিপ্টেড ডাটা ট্রান্সমিশন (SSL/TLS)',
    'সুরক্ষিত সার্ভার অবকাঠামো',
    'নিয়মিত নিরাপত্তা অডিট',
    'অ্যাক্সেস নিয়ন্ত্রণ এবং প্রমাণীকরণ',
    'ডাটা ব্যাকআপ এবং রিকভারি',
    'কর্মচারীদের গোপনীয়তা প্রশিক্ষণ',
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/<\/script>/g, '<\\/script>') }}
      />
      <div className="min-h-screen py-20 font-bengali">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">গোপনীয়তা নীতি</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। এই নীতিটি ব্যাখ্যা করে আমরা কীভাবে আপনার তথ্য সংগ্রহ করি, ব্যবহার করি এবং সুরক্ষা প্রদান করি।
            </p>
            <div className="mt-6 text-sm text-muted-foreground">
              সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Overview Card */}
          <Card className="shadow-lg mb-12 border-l-4 border-l-primary">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">নীতিমালার সংক্ষিপ্ত বিবরণ</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                জিয়া পিক্সেলে (JIA Pixel), আমরা আপনার গোপনীয়তা রক্ষা করতে এবং আপনার ব্যক্তিগত তথ্যের নিরাপত্তা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি বিশদভাবে জানায় আপনি যখন আমাদের পরিষেবাগুলো ব্যবহার করেন তখন আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সংরক্ষণ করি।
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold mb-6">১. আমরা যে তথ্য সংগ্রহ করি</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">ব্যক্তিগত তথ্য</h3>
                    <p className="text-muted-foreground mb-4">
                      আমরা আপনার কাছ থেকে স্বেচ্ছায় প্রদান করা ব্যক্তিগত তথ্য সংগ্রহ করতে পারি, যার মধ্যে রয়েছে:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                      <li>নাম, ইমেল ঠিকানা এবং ফোন নম্বর</li>
                      <li>কোম্পানির নাম এবং পদবী</li>
                      <li>প্রকল্পের প্রয়োজনীয়তা এবং ব্যবসায়িক তথ্য</li>
                      <li>বিলিং এবং পেমেন্ট সংক্রান্ত তথ্য</li>
                      <li>যোগাযোগের পছন্দসমূহ</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য</h3>
                    <p className="text-muted-foreground">
                      আপনি যখন আমাদের ওয়েবসাইট পরিদর্শন করেন, তখন আমরা স্বয়ংক্রিয়ভাবে আপনার ডিভাইস এবং ব্যবহারের ধরন সম্পর্কে কিছু তথ্য সংগ্রহ করতে পারি, যার মধ্যে আইপি (IP) ঠিকানা, ব্রাউজারের ধরন, পরিদর্শিত পেজ এবং আমাদের সাইটে কাটানো সময় অন্তর্ভুক্ত।
                    </p>
                  </div>
                </div>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-2xl font-bold mb-6">২. কীভাবে আমরা আপনার তথ্য ব্যবহার করি</h2>
                <div className="space-y-3 text-muted-foreground">
                  <p>আমরা সংগৃহীত তথ্য বিভিন্ন উদ্দেশ্যে ব্যবহার করি, যার মধ্যে রয়েছে:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>আমাদের পরিষেবাগুলি প্রদান এবং রক্ষণাবেক্ষণ করা</li>
                    <li>প্রকল্প এবং আপডেট সম্পর্কে আপনার সাথে যোগাযোগ করা</li>
                    <li>পেমেন্ট প্রসেসিং এবং অ্যাকাউন্ট পরিচালনা করা</li>
                    <li>আমাদের ওয়েবসাইট এবং পরিষেবার মান উন্নত করা</li>
                    <li>মার্কেটিং যোগাযোগ পাঠানো (আপনার সম্মতিতে)</li>
                    <li>আইনী বাধ্যবাধকতা মেনে চলা</li>
                  </ul>
                </div>
              </section>

              {/* Data Collection Points */}
              <section>
                <h2 className="text-2xl font-bold mb-6">৩. ডাটা সংগ্রহের মাধ্যম</h2>
                <div className="grid gap-4">
                  {dataCollectionPoints.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="text-primary mt-0.5 flex-shrink-0">
                        {item.icon}
                      </div>
                      <p className="text-muted-foreground">{item.point}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold mb-6">৪. ডাটা শেয়ারিং এবং প্রকাশ</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা ভাড়ায় দেই না। আমরা নিম্নলিখিত ক্ষেত্রে আপনার তথ্য শেয়ার করতে পারি:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>পরিষেবা প্রদানকারী যারা আমাদের পরিচালনায় সহায়তা করে</li>
                    <li>আইনগতভাবে প্রয়োজন হলে আইনী কর্তৃপক্ষ</li>
                    <li>পেশাদার উপদেষ্টা (আইনজীবী, হিসাবরক্ষক)</li>
                    <li>আপনার স্পষ্ট সম্মতিতে ব্যবসায়িক অংশীদারদের সাথে</li>
                  </ul>
                  <p>
                    সমস্ত তৃতীয় পক্ষ পরিষেবা প্রদানকারীদের আপনার তথ্যের গোপনীয়তা এবং নিরাপত্তা বজায় রাখতে বাধ্য করা হয়।
                  </p>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold mb-6">৫. ডাটা নিরাপত্তা</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    আমরা অননুমোদিত অ্যাক্সেস, পরিবর্তন, প্রকাশ বা ধ্বংসের বিরুদ্ধে আপনার ব্যক্তিগত ডাটা সুরক্ষা প্রদানের জন্য উপযুক্ত প্রযুক্তিগত এবং সাংগঠনিক নিরাপত্তা ব্যবস্থা গ্রহণ করি।
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {securityMeasures.map((measure, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Lock className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{measure}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold mb-6">৬. আপনার ডাটা সুরক্ষার অধিকার</h2>
                <p className="text-muted-foreground mb-4">
                  আপনার অবস্থানের উপর ভিত্তি করে, আপনার ব্যক্তিগত ডাটা সম্পর্কিত নিম্নলিখিত অধিকারগুলো থাকতে পারে:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {dataRights.map((right, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">{right}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-4 text-sm">
                  এই অধিকারগুলোর যেকোনোটি ব্যবহার করতে চাইলে, নিচে দেওয়া তথ্যের মাধ্যমে দয়া করে যোগাযোগ করুন।
                </p>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-bold mb-6">৭. কুকিজ এবং ট্র্যাকিং প্রযুক্তি</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    আমরা আপনার ওয়েবসাইটের অভিজ্ঞতা উন্নত করতে কুকিজ এবং অনুরূপ ট্র্যাকিং প্রযুক্তি ব্যবহার করি। কুকিজ আপনার ডিভাইসে সংরক্ষিত ছোট টেক্সট ফাইল যা আমাদের সাহায্য করে:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>আপনার পছন্দ এবং সেটিংস মনে রাখতে</li>
                    <li>ওয়েবসাইট ট্রাফিক এবং ব্যবহারের ধরন বিশ্লেষণ করতে</li>
                    <li>ওয়েবসাইটের কার্যকারিতা উন্নত করতে</li>
                    <li>ব্যক্তিগতকৃত বিষয়বস্তু প্রদান করতে</li>
                  </ul>
                  <p>
                    আপনি ব্রাউজার সেটিংসের মাধ্যমে কুকিজ নিয়ন্ত্রণ করতে পারেন। তবে কুকিজ ডিজেবল করলে ওয়েবসাইটের কিছু ফিচারের ব্যবহারে প্রভাব পড়তে পারে।
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-bold mb-6">৮. ডাটা সংরক্ষণ</h2>
                <p className="text-muted-foreground">
                  আমরা ব্যক্তিগত তথ্য কেবলমাত্র নির্দিষ্ট উদ্দেশ্য পূরণ করার জন্য যতক্ষণ প্রয়োজন ততক্ষণ সংরক্ষণ করি, যার মধ্যে আইনী, অ্যাকাউন্টিং বা রিপোর্টিং প্রয়োজনীয়তা অন্তর্ভুক্ত। সাধারণত, আমরা পরিষেবা শেষ হওয়ার পর ৭ বছর পর্যন্ত ক্লায়েন্টের ডাটা সংরক্ষণ করি।
                </p>
              </section>

              {/* International Transfers */}
              <section>
                <h2 className="text-2xl font-bold mb-6">৯. আন্তর্জাতিক ডাটা স্থানান্তর</h2>
                <p className="text-muted-foreground">
                  আপনার তথ্য আপনার রাজ্য, প্রদেশ বা দেশের বাইরে অবস্থিত কম্পিউটারে স্থানান্তরিত এবং বজায় রাখা হতে পারে যেখানে ডাটা সুরক্ষা আইন ভিন্ন হতে পারে। আমরা আন্তর্জাতিক স্থানান্তরের সময় আপনার ডাটা সুরক্ষিত রাখার জন্য যথাযথ ব্যবস্থা গ্রহণ করি।
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold mb-6">১০. শিশুদের গোপনীয়তা</h2>
                <p className="text-muted-foreground">
                  আমাদের পরিষেবাগুলি ১৬ বছরের কম বয়সী ব্যক্তিদের জন্য নয়। আমরা জেনেশুনে ১৬ বছরের কম বয়সী শিশুদের কাছ থেকে কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না। আপনি যদি জানতে পারেন যে কোনো শিশু আমাদের ডাটা প্রদান করেছে, তবে দয়া করে অবিলম্বে যোগাযোগ করুন।
                </p>
              </section>

              {/* Policy Updates */}
              <section>
                <h2 className="text-2xl font-bold mb-6">১১. নীতিমালার পরিবর্তন</h2>
                <p className="text-muted-foreground">
                  আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। যেকোনো পরিবর্তনের ক্ষেত্রে আমরা এই পেজে নতুন গোপনীয়তা নীতি পোস্ট করব এবং &quot;সর্বশেষ আপডেট&quot; তারিখ পরিবর্তন করব। আমরা আপনাকে পর্যায়ক্রমে এই নীতিটি পর্যালোচনা করতে উৎসাহিত করি।
                </p>
              </section>

            </div>

            {/* Quick Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">কুইক লিঙ্ক</h3>
                  <div className="space-y-3 text-sm">
                    <a href="#information-collected" className="block text-primary hover:underline">আমরা যে তথ্য সংগ্রহ করি</a>
                    <a href="#data-usage" className="block text-primary hover:underline">কিভাবে ডাটা ব্যবহার করা হয়</a>
                    <a href="#your-rights" className="block text-primary hover:underline">আপনার অধিকার</a>
                    <a href="#contact" className="block text-primary hover:underline">যোগাযোগ করুন</a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">মূল নীতিসমূহ</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>আমরা কখনোই আপনার ব্যক্তিগত ডাটা বিক্রি করি না</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Lock className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>ইন্ডাস্ট্রি স্ট্যান্ডার্ড নিরাপত্তা ব্যবস্থা</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Eye className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>স্বচ্ছ ডাটা অনুশীলন</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <User className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>আপনার ডাটার নিয়ন্ত্রণ আপনার হাতে</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Information */}
          <Card id="contact">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">যোগাযোগ করুন</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                আপনার যদি এই গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকে বা আপনার ডাটা সুরক্ষার অধিকারগুলো ব্যবহার করতে চান, তবে দয়া করে আমাদের ডাটা সুরক্ষা কর্মকর্তার সাথে যোগাযোগ করুন।
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold mb-2">ইমেইল</h3>
                  <p className="text-primary">privacy@jiapixel.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">প্রতিক্রিয়ার সময়</h3>
                  <p className="text-muted-foreground">৪৮ ঘন্টার মধ্যে</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ফোন</h3>
                  <p className="text-muted-foreground">+১ (৫৫৫) ১২৩-৪৫৬৭</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ঠিকানা</h3>
                  <p className="text-muted-foreground">১২৩ ডিজাইন স্ট্রিট, ক্রিয়েটিভ ডিস্ট্রিক্ট, সিএ ৯০২১০</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Footer */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>
              এই গোপনীয়তা নীতি GDPR, CCPA এবং অন্যান্য প্রযোজ্য ডাটা সুরক্ষা নিয়মাবলীর সাথে সামঞ্জস্যপূর্ণ। আমাদের পরিষেবাগুলো ব্যবহার করার মাধ্যমে, আপনি স্বীকার করছেন যে আপনি এই গোপনীয়তা নীতিটি পড়েছেন এবং বুঝেছেন।
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;