// G:\jiapixel-updated\src\app\(mainlayout)\refund-policy\page.tsx
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'রিফান্ড পলিসি | JIA Pixel - স্বচ্ছ ও স্পষ্ট নির্দেশিকা',
  description: 'জিয়া পিক্সেল (JIA Pixel) এর রিফান্ড পলিসি। আমাদের রিফান্ড যোগ্যতা, প্রক্রিয়া এবং ডিজিটাল ডিজাইন ও ডেভেলপমেন্ট পরিষেবার শর্তাবলী সম্পর্কে জানুন। স্বচ্ছ এবং ন্যায্য নির্দেশিকা।',
  keywords: 'refund policy, রিফান্ড পলিসি, টাকা ফেরত গ্যারান্টি, ডিজিটাল এজেন্সি রিফান্ড, ওয়েব ডিজাইন রিফান্ড, সার্ভিস বাতিল',

  openGraph: {
    title: 'রিফান্ড পলিসি | JIA Pixel',
    description: 'জিয়া পিক্সেল ডিজিটাল পরিষেবার জন্য স্বচ্ছ এবং স্পষ্ট রিফান্ড নির্দেশিকা',
    type: 'website',
    url: 'https://www.jiapixel.com/refund-policy',
    siteName: 'JIA Pixel',
    images: [
      {
        url: '/og-refund.jpg',
        width: 1200,
        height: 630,
        alt: 'JIA Pixel রিফান্ড পলিসি',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'রিফান্ড পলিসি | JIA Pixel',
    description: 'জিয়া পিক্সেল ডিজিটাল পরিষেবার জন্য স্বচ্ছ এবং স্পষ্ট রিফান্ড নির্দেশিকা',
    images: ['/og-refund.jpg'],
  },

  alternates: {
    canonical: 'https://www.jiapixel.com/refund-policy',
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
  name: 'রিফান্ড পলিসি',
  description: 'জিয়া পিক্সেল ডিজিটাল এজেন্সি পরিষেবার জন্য রিফান্ড পলিসি এবং নির্দেশিকা',
  url: 'https://www.jiapixel.com/refund-policy',
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'রিফান্ড পলিসি কী?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'কাজ শুরু হওয়ার আগে বাতিল করা প্রকল্পের জন্য আমরা সম্পূর্ণ রিফান্ড প্রদান করি এবং চলমান কাজের জন্য আনুপাতিক রিফান্ড প্রদান করি। সম্পন্ন প্রকল্পের জন্য কোনো রিফান্ড নেই।',
        },
      },
    ],
  },
};

const LAST_UPDATED = '2025-01-01';

const RefundPolicyPage = () => {
  const refundScenarios = [
    {
      scenario: "কাজ শুরু হওয়ার আগে প্রকল্প বাতিল",
      refund: "ডিপোজিটের সম্পূর্ণ রিফান্ড",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      notes: "পেমেন্টের ২৪ ঘন্টার মধ্যে অনুরোধ করতে হবে"
    },
    {
      scenario: "কাজ শুরু হওয়ার পর প্রকল্প বাতিল",
      refund: "অসমাপ্ত কাজের জন্য আনুপাতিক রিফান্ড",
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      notes: "কাজের ঘন্টা এবং ব্যবহৃত উপকরণের ওপর ভিত্তি করে"
    },
    {
      scenario: "প্রকল্প সম্পন্ন এবং ডেলিভারি করা হয়েছে",
      refund: "কোনো রিফান্ড পাওয়া যাবে না",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      notes: "প্রকল্প সম্পন্ন হওয়ার পর সমস্ত বিক্রয় চূড়ান্ত বলে গণ্য হবে"
    },
    {
      scenario: "ক্লায়েন্ট প্রয়োজনীয় উপকরণ প্রদানে ব্যর্থ হলে",
      refund: "কোনো রিফান্ড নেই - প্রকল্প স্থগিত করা হতে পারে",
      icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
      notes: "৩০ দিন নিষ্ক্রিয় থাকার পর, প্রকল্প বন্ধ করা হতে পারে"
    }
  ];

  const nonRefundableItems = [
    "প্রাথমিক পরামর্শ এবং কৌশল সেশন",
    "গবেষণা এবং ডিসকভারি পর্বের কাজ",
    "স্টক ফটোগ্রাফি এবং ফন্ট লাইসেন্স",
    "তৃতীয় পক্ষের প্লাগইন এবং সফটওয়্যার ক্রয়",
    "ডোমেইন রেজিস্ট্রেশন এবং হোস্টিং ফি",
    "জরুরী (Rush) সার্ভিস ফি"
  ];

  const refundProcess = [
    {
      step: "১",
      title: "রিফান্ড অনুরোধ জমা দিন",
      description: "আপনার প্রকল্পের বিবরণ এবং রিফান্ডের কারণসহ refunds@jiapixel.com এ আমাদের সাথে যোগাযোগ করুন"
    },
    {
      step: "২",
      title: "পর্যালোচনা সময়কাল",
      description: "আমরা ৩-৫ কার্যদিবসের মধ্যে আপনার অনুরোধ পর্যালোচনা করব এবং যোগ্যতা যাচাই করব"
    },
    {
      step: "৩",
      title: "সিদ্ধান্ত এবং প্রক্রিয়াকরণ",
      description: "অনুমোদিত হলে, ১০ কার্যদিবসের মধ্যে মূল পেমেন্ট পদ্ধতিতে রিফান্ড প্রসেস করা হয়"
    },
    {
      step: "৪",
      title: "নিশ্চিতকরণ",
      description: "রিফান্ড প্রসেস হয়ে গেলে আপনি ইমেলের মাধ্যমে নিশ্চিতকরণ পাবেন"
    }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">রিফান্ড পলিসি</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              আমাদের ডিজিটাল পরিষেবার জন্য স্বচ্ছ এবং স্পষ্ট রিফান্ড নির্দেশিকা
            </p>
            <div className="mt-6 text-sm text-muted-foreground">
              সর্বশেষ আপডেট: {new Date(LAST_UPDATED).toLocaleDateString('bn-BD', {
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
                জিয়া পিক্সেলে (JIA Pixel), আমরা আমাদের সমস্ত প্রকল্পে ব্যতিক্রমী মূল্য এবং গুণমান প্রদান করার চেষ্টা করি। এই রিফান্ড পলিসিটি সেই পরিস্থিতিগুলো রূপরেখা দেয় যার অধীনে রিফান্ড মঞ্জুর করা যেতে পারে এবং আমাদের ক্লায়েন্ট ও আমাদের টিমের প্রতি ন্যায্য আচরণের প্রতিশ্রুতি নিশ্চিত করে।
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">

            {/* Refund Eligibility */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">রিফান্ড যোগ্যতা</h2>
                <div className="space-y-4">
                  {refundScenarios.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.scenario}
                        </h3>
                        <p className="text-primary font-medium mb-1">
                          {item.refund}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Sidebar */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">মূল বিষয়সমূহ</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>নতুন প্রকল্পের জন্য ২৪ ঘন্টা কুলিং-অফ পিরিয়ড</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>রিফান্ড প্রসেস করার জন্য ১০ কার্যদিবস</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>পেমেন্ট প্রসেসরের কাছে বিবাদ করার আগে আমাদের সাথে যোগাযোগ করুন</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>সম্পন্ন কাজের জন্য কোনো রিফান্ড নেই</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Non-Refundable Items */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">অফেরতযোগ্য আইটেম এবং পরিষেবাসমূহ</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {nonRefundableItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                * এই আইটেমগুলো আপনার পক্ষে আমাদের বহন করা খরচ যা একবার কেনা হলে ফেরতযোগ্য নয়।
              </p>
            </CardContent>
          </Card>

          {/* Refund Process */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-8">রিফান্ড অনুরোধ প্রক্রিয়া</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {refundProcess.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Circumstances */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">বিশেষ পরিস্থিতি</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-l-green-500 pl-4 py-2">
                  <h3 className="font-semibold text-foreground mb-1">পরিষেবার মান সংক্রান্ত সমস্যা</h3>
                  <p className="text-muted-foreground">
                    আপনি যদি আমাদের কাজের মান নিয়ে অসন্তুষ্ট হন, তবে আমরা রিফান্ড বিবেচনা করার আগে সমস্যাগুলো সমাধানের জন্য সর্বোচ্চ চেষ্টা করব। আপনার সন্তুষ্টি আমাদের অগ্রাধিকার।
                  </p>
                </div>
                <div className="border-l-4 border-l-amber-500 pl-4 py-2">
                  <h3 className="font-semibold text-foreground mb-1">প্রকল্পে বিলম্ব</h3>
                  <p className="text-muted-foreground">
                    আমাদের নিয়ন্ত্রণের বাইরের পরিস্থিতির কারণে (ক্লায়েন্টের প্রতিক্রিয়া, তৃতীয় পক্ষের ওপর নির্ভরতা ইত্যাদি) বিলম্ব রিফান্ডের ভিত্তি হিসেবে গণ্য হবে না।
                  </p>
                </div>
                <div className="border-l-4 border-l-blue-500 pl-4 py-2">
                  <h3 className="font-semibold text-foreground mb-1">সিদ্ধান্ত পরিবর্তন</h3>
                  <p className="text-muted-foreground">
                    আমরা বুঝি যে প্রয়োজনীয়তা পরিবর্তন হতে পারে। বাতিলের পরিবর্তে প্রকল্প সমন্বয় নিয়ে আলোচনা করতে আমাদের সাথে যত দ্রুত সম্ভব যোগাযোগ করুন।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">সাহায্য প্রয়োজন?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                আপনার যদি আমাদের রিফান্ড পলিসি সম্পর্কে কোনো প্রশ্ন থাকে বা রিফান্ডের অনুরোধ করতে হয়, তবে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন। আমরা আপনাকে সাহায্য করতে এখানে আছি।
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div>
                  <h3 className="font-semibold mb-2">ইমেইল</h3>
                  <p className="text-primary">refunds@jiapixel.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">প্রতিক্রিয়ার সময়</h3>
                  <p className="text-muted-foreground">২৪ ঘন্টার মধ্যে</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ফোন</h3>
                  <p className="text-muted-foreground">+১ (৫৫৫) ১২৩-৪৫৬৭</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Footer */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>
              এই রিফান্ড পলিসিটি কোনো নোটিশ ছাড়াই পরিবর্তন করা হতে পারে। আপডেটের জন্য পর্যায়ক্রমে এই পেজটি চেক করুন। আমাদের পরিষেবা ব্যবহার করার মাধ্যমে, আপনি এই রিফান্ড পলিসি স্বীকার এবং এর সাথে একমত পোষণ করছেন।
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default RefundPolicyPage;