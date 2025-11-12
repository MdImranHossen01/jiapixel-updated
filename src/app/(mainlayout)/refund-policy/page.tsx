import React from 'react';
import Link from 'next/link';

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
   

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Refund Eligibility</h2>
              <p>
                At Jiapixel, we strive to provide high-quality services that meet our clients&apos; expectations. 
                However, we understand that there may be situations where a refund is requested. This policy 
                outlines the conditions under which refunds may be issued.
              </p>
              <p className="mt-4">
                Refunds may be considered under the following circumstances:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>If we fail to deliver the agreed-upon services within the specified timeframe</li>
                <li>If the delivered services significantly deviate from what was outlined in the service agreement</li>
                <li>If technical issues on our end prevent the successful completion or delivery of the service</li>
                <li>If a duplicate payment was made in error</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Non-Refundable Services</h2>
              <p>
                The following services are generally non-refundable:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Services that have been fully completed and delivered as per the agreement</li>
                <li>Custom design work that has been approved by the client during the development process</li>
                <li>Services that have been substantially completed (more than 75%)</li>
                <li>Requests for refunds made more than 30 days after service completion</li>
                <li>Services delayed due to client unresponsiveness or failure to provide necessary materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Refund Request Process</h2>
              <p>
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 my-4">
                <li>Contact our support team at <a href="mailto:support@jiapixel.com" className="text-primary hover:underline">support@jiapixel.com</a> with your refund request</li>
                <li>Include your order number, service details, and a detailed explanation of why you are requesting a refund</li>
                <li>Provide any relevant evidence or documentation to support your claim</li>
                <li>Our team will review your request within 5-7 business days</li>
                <li>We will contact you with our decision and any next steps</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Refund Processing</h2>
              <p>
                If your refund request is approved, the following applies:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Refunds will be processed within 10 business days of approval</li>
                <li>Refunds will be issued to the original payment method used for the purchase</li>
                <li>Depending on your payment provider, it may take an additional 5-10 business days for the refund to appear in your account</li>
                <li>For partially completed services, a pro-rated refund may be issued based on the work completed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Service Modifications</h2>
              <p>
                In some cases, instead of a refund, we may offer to modify or re-do the service to meet your 
                requirements. This option will be presented to you if we believe it can address your concerns 
                effectively.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Dispute Resolution</h2>
              <p>
                If you are not satisfied with our decision regarding your refund request, you may request a review 
                by our management team. To do so, please contact us at <a href="mailto:management@jiapixel.com" className="text-primary hover:underline">management@jiapixel.com</a> 
                with &quot;Refund Review Request&quot; in the subject line.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Policy Changes</h2>
              <p>
                Jiapixel reserves the right to modify this refund policy at any time. Any changes will be effective 
                immediately upon posting the revised policy on our website. We encourage you to review this policy 
                periodically for any updates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
              <p>
                If you have any questions about this refund policy, please contact us:
              </p>
              <address className="not-italic mt-4">
                <p>Jiapixel</p>
                <p>Customer Support Team</p>
                <p>123 Business Ave, Suite 100</p>
                <p>New York, NY 10001</p>
                <p>Email: support@jiapixel.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </address>
            </section>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default RefundPolicyPage;