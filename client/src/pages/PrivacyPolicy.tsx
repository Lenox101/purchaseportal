
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Prime Picks ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">We may collect information about you in various ways, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Personal Data:</strong> Name, email address, phone number, billing and shipping addresses, payment information, and other information you provide when creating an account, making a purchase, or contacting us.</li>
            <li className="mb-2"><strong>Usage Data:</strong> Information about how you use our website, including pages visited, time spent, and actions taken.</li>
            <li className="mb-2"><strong>Device Information:</strong> IP address, browser type, operating system, and other technical information about your device.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We may use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Processing and fulfilling your orders</li>
            <li className="mb-2">Creating and managing your account</li>
            <li className="mb-2">Providing customer support</li>
            <li className="mb-2">Sending order confirmations and updates</li>
            <li className="mb-2">Sending marketing communications (with your consent)</li>
            <li className="mb-2">Improving our website and services</li>
            <li className="mb-2">Analyzing usage patterns and trends</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to collect information about your browsing activities. You can manage your cookie preferences through your browser settings.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Information Sharing</h2>
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Service providers who assist us in operating our website and business</li>
            <li className="mb-2">Payment processors to complete transactions</li>
            <li className="mb-2">Shipping companies to deliver your orders</li>
            <li className="mb-2">Legal authorities when required by law</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
          <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Accessing the personal data we hold about you</li>
            <li className="mb-2">Correcting inaccurate or incomplete information</li>
            <li className="mb-2">Requesting deletion of your personal data</li>
            <li className="mb-2">Withdrawing consent for certain processing activities</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
          <p>
            If you have any questions or concerns about our Privacy Policy, please contact us at privacy@primepicks.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
