export type Categories = {
  suffix: string;
  labels: string[];
  descriptions?: { [key: string]: string };
};

export const CATEGORIES_A: Categories = {
  suffix: '-cA',
  labels: [
    'e-commerce product list',
    'e-commerce product details',
    'e-commerce cart',
    'about company',
    'frequently asked questions',
    'press',
    'legal privacy policy',
    'legal terms and conditions',
    'accessibility statement',
    'e-commerce returns and exchanges',
    'e-commerce assistance',
    'blog',
    'account register',
    'account login',
    'my account',
    'account orders',
    'physical store location',
    'contact us',
    'e-commerce promotional content',
    'other',
  ],
};

export const CATEGORIES_A_WITH_DESCRIPTION: Categories = {
  suffix: '-cA',
  labels: [
    'e-commerce product list',
    'e-commerce product details',
    'e-commerce cart',
    'about company',
    'frequently asked questions',
    'press',
    'legal privacy policy',
    'legal terms and conditions',
    'accessibility statement',
    'e-commerce returns and exchanges',
    'e-commerce assistance',
    'blog',
    'account register',
    'account login',
    'my account',
    'account orders',
    'physical store location',
    'contact us',
    'e-commerce promotional content',
    'other',
  ],
  descriptions: {
    'e-commerce product list':
      ' a web page in this category could include a list of products, product images, product descriptions, product reviews, pricing information, product availability, product categories, related products, customer service information, checkout options, payment methods, shipping information, and return policies.',
    'e-commerce product details':
      ' web page will include a product description, product images, product ratings/reviews, pricing information, availability information, product specifications, related products, add to cart or buy now buttons, and customer service information.',
    'e-commerce cart':
      ' an ecommerce website page may include product descriptions, product images, product reviews, customer service contact information, payment options, checkout forms, order tracking information, and promotional offers. Additionally, the page may include links to other pages on the site, such as a home page, a product catalog, product categories, customer service pages, and FAQs. The page may also include links to social media pages and other relevant webpages. Finally, the page may include meta tags or other code to ensure the page is properly optimized for search engine visibility.',
    'about company':
      " a web page belonging to an ecommerce website could include information about the company such as its history, mission statement, and core values. It could also include background information about the company's founders, a list of products and services offered, customer reviews and testimonials, and contact information. Additionally, it could provide links to other relevant websites and social media accounts, such as a blog or Facebook page. Finally, the page could contain information about any special offers or discounts that the company is running, as well as a FAQ section about the company's products, services, and policies.",
    'frequently asked questions':
      ' could include questions and answers related to the ecommerce website, such as how to place an order, what payment methods are accepted, what delivery options are available, how to return an item, what customer service options are available, and any other relevant information.',
    press:
      ' a web page belonging to an ecommerce website for this category could include articles, press releases, news stories, blog posts, images, videos, links to social media accounts, and contact information. Additionally, the page may include product information, sales and promotions, customer reviews, and other related content.',
    'legal privacy policy':
      " could include an overview of the company's privacy policy, a description of the types of data collected from customers, a description of how customers' data is used and stored, a description of customers' rights regarding their data, a description of how customers' data is kept secure, a description of any third-party services used to store customers' data, as well as contact information for customers to get in touch with the company about privacy-related inquiries.",
    'legal terms and conditions':
      " a web page belonging to an ecommerce website could include information about the terms and conditions of use, such as the company's privacy policy, return policy, shipping policy, payment terms, and other applicable laws and regulations. It could also include information about the company's customer service policies, the availability of customer support, and contact information. Additionally, the page could include information about product warranties, guarantees, and other product-related terms and conditions. The page may also include links to relevant policies and regulations, and other related documents.",
    'accessibility statement':
      " could include information on the accessibility features of the website, detailing how users with disabilities can access the website's features. This could include information on keyboard navigation, screen readers, assistive technology and other relevant topics. It could also include contact information for the website's customer service team, so users can get additional support if needed. Additionally, it could provide links to resources and documents that provide further information on accessibility technologies.",
    'e-commerce returns and exchanges':
      ' a web page belonging to an ecommerce website could include information about the return and exchange process, such as return policies, return deadlines, exchange options, instructions on how to return or exchange an item, contact information for customer service, and any applicable fees. It could also include FAQs related to returns and exchanges, customer reviews of the return and exchange process, and any relevant legal information. Additionally, the page could feature images, videos, and other resources that help customers better understand the returns and exchanges process.',
    'e-commerce assistance':
      ' to an ecommerce website could contain information such as product descriptions, customer service contact information, shipping policies, payment options, returns policies, sales and promotions, customer reviews, FAQs, and other related information. It could also include links to related pages, such as the homepage, customer service page, product pages, and checkout page. Additionally, the web page could feature images and videos related to the products or services being offered. Finally, the page could include links to social media accounts and contact forms.',
    blog: ' a blog page belonging to an ecommerce website could include articles or posts about topics related to the ecommerce business, such as product reviews, customer testimonials, insights into the industry, trends in the market, tips and tricks for customers, and more. It could also include news or announcements about the ecommerce business, such as new product launches, special offers, discounts, and promotions. Additionally, the blog page could include links to other pages on the ecommerce website, such as the product catalog, customer service page, and checkout page.',
    'account register':
      ' the page would include registration form fields such as name, email, address, phone number, password, and any other applicable information. There would also be buttons to submit the form, as well as a link to the terms of service and privacy policy. Additionally, there may be options to connect with social media accounts and/or sign up for promotional emails.',
    'account login':
      " web page belonging to an ecommerce website could include a login form to enter a username and password, a link to create a new account, a link to reset a forgotten password, a link to contact customer service, a link to view the terms and conditions of the website, a link to view the privacy policy, and a link to the website's homepage.",
    'my account':
      " a web page belonging to an ecommerce website could include information such as a customer's account details, order history, payment information, address book, saved items, wish list, coupon codes, account settings, notifications, and any other relevant account information. Additionally, the page might feature links to product pages, customer service, FAQs, and other related information.",
    'account orders':
      " the web page could include a list of the customer's previous orders, order history, account details, payment information, delivery information, customer service contact information, and a search box to search for specific orders. The page could also feature order tracking information, order status, order cancellation and returns information, loyalty program information, and product recommendations. Additionally, the page could provide links to additional resources such as FAQs, product reviews, and customer support contact information.",
    'physical store location':
      " a web page belonging to an ecommerce website for this category would include information about the physical store's location, hours of operation, contact information, directions to the store, and any other relevant details. Additionally, it could include images and videos of the store, customer reviews, lists of products or services offered, and links to other pages on the website related to the store.",
    'contact us':
      " the web page could include text, forms, and images related to contact information for the ecommerce website, such as an address, telephone number, email address, and social media links. It might also include a map of the website's physical location, a contact form to send messages, and customer service contact information. Additionally, the page could include a customer service FAQ section, customer support hours of operation, and links to other important ecommerce website information.",
    'e-commerce promotional content':
      ' the web page can include product descriptions, product images, reviews, customer testimonials, pricing information, offers and discounts, promotional banners, related product recommendations, shipping and return policies, customer service contact information, payment options, and links to social media pages.',
    other:
      ' to an ecommerce website could contain product information, pricing, images, customer reviews, payment options, shipping information, customer service contact information, links to related products, and links to other pages on the website. It could also include promotional discounts, links to social media accounts, and other promotional content.',
  },
};

export const CATEGORIES_B: Categories = {
  suffix: '-cB',
  labels: [
    'e-commerce product list',
    'e-commerce product details',
    'e-commerce cart',
    'e-commerce returns/refunds and exchanges',
    'e-commerce shipping/delivery information',
    'e-commerce customer reviews/testimonial',
    'e-commerce gift cards',
    'customer assistance/support or contact us',
    'information about the company',
    'career opportunities',
    'blog',
    'physical store address/location/direction',
    'press material',
    'legal privacy policy',
    'legal terms and conditions',
    'legal accessibility statement',
    'my account',
    'account register',
    'account login',
    'account orders',
    'page not found',
    'other',
  ],
};

export const CATEGORIES_C: Categories = {
  suffix: '-cC',
  labels: [
    'e-commerce products list',
    'e-commerce product details',
    'e-commerce cart',
    'e-commerce returns/refunds and exchanges',
    'e-commerce shipping/delivery information',
    'e-commerce customer reviews/testimonial',
    'e-commerce gift cards',
    'customer service/assistance/support',
    'contact us/get a quote',
    'information about the company',
    'career opportunities',
    'blog',
    'physical store address/location/direction',
    'press material',
    'legal informations',
    'account login/register',
    'account orders',
    'page not found',
    'other',
  ],
};
