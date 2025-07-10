import { Component, } from 'solid-js';

interface NavItem {
  label: string;
  href: string;
}



interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

interface FooterLink {
  title: string;
  links: string[];
}

const App: Component = () => {

  const navItems: NavItem[] = [
    { label: 'Beranda', href: '#' },
    { label: 'Statistik', href: '#' },
    { label: 'Daily Spend', href: '#' },
    { label: 'Profile', href: '#' },
    { label: 'Budget Planner', href: '#' }
  ];

 

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah M.',
      text: 'This app has completely changed how I manage my finances. The budget tracking is incredibly intuitive.',
      rating: 5
    },
    {
      name: 'John D.',
      text: 'Great financial tool! I love how easy it is to track my daily expenses using Biaya.',
      rating: 5
    },
    {
      name: 'Lisa K.',
      text: 'Perfect budgeting companion! The personalized suggestions have helped me save so much using Biaya.',
      rating: 5
    }
  ];

  const footerLinks: FooterLink[] = [
    {
      title: 'Biaya',
      links: ['About Us', 'Privacy Policy', 'Terms of Service']
    },
    {
      title: 'Plan',
      links: ['Free Plan', 'Premium Plan', 'Enterprise']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact Us', 'Documentation']
    },
    {
      title: 'Connect',
      links: ['Twitter', 'Facebook', 'Instagram']
    }
  ];

  const StarRating: Component<{ rating: number }> = (props) => {
    return (
      <div class="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <span class={`text-sm ${i < props.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div class="min-h-screen bg-white">
      {/* Navigation */}
      <nav class="bg-black shadow-sm">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-indigo-600">Biaya</h1>
            </div>
            <div class="">
              <div class="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <a
                    href={item.href}
                    class="text-white hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-light transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section class="bg-indigo-700  text-white py-20">
        <div class="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Track Your<br />
            Spending Amount
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-indigo-100 max-w-2xl mx-auto">
            Biaya is an platform that helps you to manage spending money from your asset.
          </p>
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg" onclick={() => window.location.href = '/SignIn'}>
            Get Started →
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section class="py-20 bg-gray-50">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Features to Track Your Spend
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              Gain features a carefully designed to help you better understand your spending
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span class="text-2xl">📊</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Statistic</h3>
              <p class="text-gray-600">Record all Daily Tracking with ease</p>
            </div>

            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <span class="text-2xl">💰</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Budget Planner</h3>
              <p class="text-gray-600">Limit your budget for items</p>
            </div>

            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <span class="text-2xl">💡</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Personalized Suggestions</h3>
              <p class="text-gray-600">Activities tailored to your condition</p>
            </div>

            {/* Chart Visualization */}
            <div class="md:col-span-2 lg:col-span-3 bg-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
              <div class="relative z-10">
                <h3 class="text-2xl font-bold mb-2">SIMPLE PROFESSIONAL INDIVIDUAL</h3>
                <p class="text-blue-100 mb-6">Track your spending with beautiful charts</p>
              </div>
              
              {/* Simulated Chart */}
              <div class="flex items-end space-x-4 mt-8">
                <div class="bg-white bg-opacity-30 rounded-t-lg w-12 h-16"></div>
                <div class="bg-white bg-opacity-50 rounded-t-lg w-12 h-24"></div>
                <div class="bg-white bg-opacity-70 rounded-t-lg w-12 h-32"></div>
                <div class="bg-white bg-opacity-90 rounded-t-lg w-12 h-20"></div>
                <div class="bg-white rounded-t-lg w-12 h-28"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="bg-indigo-700 py-16">
        <div class="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Smart money, brighter future
          </h2>
          <div class="flex justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section class="py-20 bg-white">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Do They Say?
            </h2>
            <p class="text-lg text-gray-600">
              Real experiences from individuals users
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div class="bg-gray-50 rounded-2xl p-8">
                <StarRating rating={testimonial.rating} />
                <p class="text-gray-700 mt-4 mb-4">"{testimonial.text}"</p>
                <p class="font-semibold text-gray-900">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section class="bg-indigo-700  py-20">
        <div class="w-full px-4 sm:px-6 lg:px-88 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Begin Your<br />
            Spend Tracking?
          </h2>
          <p class="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users already benefiting from Biaya for a more smarter and saving life.
          </p>
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg" onclick={() => window.location.href = '/SignIn'}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer class="bg-indigo-900 text-white py-16">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div>
                <h3 class="font-semibold text-lg mb-4">{section.title}</h3>
                <ul class="space-y-2">
                  {section.links.map((link) => (
                    <li>
                      <a href="#" class="text-indigo-200 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div class="border-t border-indigo-800 mt-12 pt-8 text-center">
            <p class="text-indigo-200">
              © 2024 Biaya. All rights reserved. Made with ❤️ for better financial management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;