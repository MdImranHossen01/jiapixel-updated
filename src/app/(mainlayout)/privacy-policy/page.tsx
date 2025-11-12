import React from 'react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p>
                At Jiapixel, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you 
                as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law 
                protects you.
              </p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Personal Information</h3>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li><strong>Identity Data:</strong> Title, first name, last name, username, etc.</li>
                <li><strong>Contact Data:</strong> Billing address, email address, and telephone numbers.</li>
                <li><strong>Technical Data:</strong> Internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                <li><strong>Profile Data:</strong> Your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>To provide and maintain our service</li>
                <li>To process transactions and send related information</li>
                <li>To provide customer support</li>
                <li>To provide analysis or valuable information so that we can improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
              <p>
                We may share your personal information with third-party service providers to assist us in providing our service. We only share 
                your information with these partners to the extent necessary to perform their services. We require our third-party service 
                providers to protect your personal information and not use it for any other purpose.
              </p>
              <p className="mt-4">
                We may also disclose your personal information if required by law or in response to valid requests by public authorities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, 
                please remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we 
                strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Your Privacy Rights</h2>
              <p>
                You have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit 
                the use of your personal data. If you wish to be informed what personal data we hold about you or if you want it to be 
                removed from our systems, please contact us.
              </p>
              <p className="mt-4">
                In certain circumstances, you have the following data protection rights:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>The right to access, update or to delete the information we have on you</li>
                <li>The right of rectification</li>
                <li>The right to object</li>
                <li>The right to restriction</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Children&apos;s Privacy</h2>
              <p>
                Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable 
                information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with 
                personal data, please contact us. If we become aware that we have collected personal data from children without verification 
                of parental consent, we take steps to remove that information from our servers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies 
                are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to 
                refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able 
                to use some portions of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Links to Other Sites</h2>
              <p>
                Our service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be 
                directed to that third party&apos;s site. We strongly advise you to review the privacy policy of every site you visit. We have 
                no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on 
                this page and updating the &quot;Last updated&quot; date at the top of this privacy policy. You are advised to review this privacy 
                policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p>
                If you have any questions about this privacy policy, please contact us:
              </p>
              <address className="not-italic mt-4">
                <p>Jiapixel</p>
                <p>Privacy Officer</p>
                <p>123 Business Ave, Suite 100</p>
                <p>New York, NY 10001</p>
                <p>Email: privacy@jiapixel.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </address>
            </section>
          </div>
        </div>
      </main>

 
    </div>
  );
};

export default PrivacyPolicyPage;