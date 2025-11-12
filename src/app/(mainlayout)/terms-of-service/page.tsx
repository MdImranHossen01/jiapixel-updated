import React from 'react';
import Link from 'next/link';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
     

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using this website&apos;s particular services, you shall be subject to any posted guidelines or rules 
                applicable to such services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials on Jiapixel&apos;s website for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this 
                license you may not:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on Jiapixel&apos;s website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or &#34;mirror&#34; the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
              <p>
                The materials on Jiapixel&apos;s website are provided on an &apos;as is&apos; basis. Jiapixel makes no warranties, expressed or implied, 
                and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of 
                merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
              <p>
                In no event shall Jiapixel or its suppliers be liable for any damages (including, without limitation, damages for loss of 
                data or profit, or due to business interruption) arising out of the use or inability to use the materials on Jiapixel&apos;s 
                website, even if Jiapixel or a Jiapixel authorized representative has been notified orally or in writing of the possibility 
                of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on Jiapixel&apos;s website could include technical, typographical, or photographic errors. Jiapixel does 
                not warrant that any of the materials on its website are accurate, complete, or current. Jiapixel may make changes to the 
                materials contained on its website at any time without notice. Jiapixel does not, however, make any commitment to update 
                the materials.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
              <p>
                Jiapixel has not reviewed all of the sites linked to its website and is not responsible for the contents of any such 
                linked site. The inclusion of any link does not imply endorsement by Jiapixel of the site. Use of any such linked website 
                is at the user&apos;s own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
              <p>
                Jiapixel may revise these terms of service for its website at any time without notice. By using this website you are 
                agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of New York, USA and you irrevocably 
                submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <address className="not-italic mt-4">
                <p>Jiapixel</p>
                <p>123 Business Ave, Suite 100</p>
                <p>New York, NY 10001</p>
                <p>Email: contact@jiapixel.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </address>
            </section>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default TermsOfServicePage;