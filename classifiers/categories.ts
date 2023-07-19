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
    'e-commerce promotional content',
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
    'e-commerce product details',
    'e-commerce product list',
    'e-commerce cart',
    'e-commerce shipping/delivery information',
    'e-commerce customer reviews/testimonial',
    'e-commerce gift cards',
    'e-commerce returns/refunds and exchanges',
    'physical store address/location/direction',
    'customer service/assistance/support',
    'contact us/get a quote',
    'blog',
    'legal informations',
    'information about the company',
    'press material',
    'career opportunities',
    'account login/register',
    'other',
    'page not found',
  ],
  descriptions: {
    'e-commerce product details':
      'page presenting a product with its description and features and price and reviews and related products and add to cart button',
    'e-commerce product list':
      'page presenting different products or a catalog or list of products usually with filter and sort and pagination',
    'e-commerce cart':
      'page presenting the cart with the list of products and the total price and the checkout button',
    'e-commerce shipping/delivery information': '',
    'e-commerce customer reviews/testimonial': '',
    'e-commerce gift cards':
      'page presenting gift cards or promotional codes or coupons',
    'e-commerce returns/refunds and exchanges': '',
    'physical store address/location/direction':
      'page presenting the address and location and opening hours of physical store',
    'customer service/assistance/support':
      'page containing answer to frequently asked questions or a form or a chat to ask a question',
    'contact us/get a quote':
      'page containing a form to contact the company or get a customized pricing quote',
    blog: 'page containing articles or posts about topics related to the company or the company products',
    'legal informations':
      'page containing any kind of legal information such as terms and condition, privacy policy, etc',
    'information about the company':
      'page containing information about the company such as its history, mission statement, and core values',
    'press material': '',
    'career opportunities': '',
    'account login/register': '',
    other: '',
    'page not found': '',
  },
};

export const CATEGORIES_D: Categories = {
  suffix: '-cD',
  labels: [
    'e-commerce product list/catalog',
    'e-commerce product details',
    'e-commerce cart',
    'e-commerce shipping/delivery information',
    'e-commerce customer reviews/testimonial',
    'e-commerce gift cards',
    'e-commerce returns/refunds and exchanges',
    'physical store address/location/direction',
    'customer support and assistance/frequently asked questions',
    'contact us/get a pricing quote',
    'blog',
    'legal informations and terms and conditions',
    'information about the company',
    'press material',
    'career opportunities',
    'account login/register',
    'other',
    'page not found',
  ],
  descriptions: {
    'e-commerce product list/catalog':
      "A web page belonging to the category of e-commerce product list or catalog might prominently feature various products available for purchase. These products are likely displayed in a grid or list format, with each product having a small thumbnail image, a title or name, a brief description, and the price. There could also be a ratings or reviews system where customers indicate their satisfaction with the product. This page may also contain sorting and filtering options to allow customers to customize their browsing experience based on categories like price, brand, popularity, etc. There may be pagination at the bottom to navigate to different pages of products. Each product might be clickable, leading to its detailed product page. There might be a shopping cart icon to add items directly into the cart from the product list page. Search bar, navigation menus designed to aid visitor's shopping experience could be a part of the webpage as well.",
    'e-commerce product details':
      "A web page in an e-commerce site under the category \"Product Details\" might contain detailed information about a specific product available for purchase. This could include the product's title, descriptions, price, available sizes or models, color options, specifications, features, and advantages. \n\nThere might also be high-resolution images or videos showing the product from different angles or in use, user reviews and ratings, related products or recently viewed items, stock availability, delivery options, return policy, and a CTA (Call to Action) button like 'Add to Cart' or 'Buy Now'. \n\nThere could be a section dedicated to demonstrating the product's use or comparisons with similar products. Manufacturer details, warranty, or guarantee information could also be part of the content. The layout would typically be clear, clean, and user-friendly. The page may also contain breadcrumb navigation to assist users in their shopping journey. In essence, the page is designed to provide all the necessary information and assure customers about their purchase.",
    'e-commerce cart':
      "A web page in the e-commerce cart category would normally feature a summary view of selected products the user is interested in purchasing. The items are listed with key details such as product name, images, brief descriptions, and prices. The page may also show the quantity of each item chosen, options for making changes to the selected items i.e., adding more quantities or removing an item. Moreover, it can compute the total cost of all the items in the cart, including taxes and shipping costs. The page usually presents buttons or links for users to proceed to the checkout process, continue shopping or perhaps apply discount codes. It might also suggest other related products for up-selling or cross-selling. The user's cart is typically saved even if they navigate away from the page, providing a seamless shopping experience.",
    'e-commerce shipping/delivery information':
      'The web page containing e-commerce shipping/delivery information would potentially provide details about the various shipping methods available, estimated delivery time frames for both local and international orders, as well as shipping charges, if any. The content may also include information about how to track orders, shipping policies and restrictions. Graphics, FAQs, or illustrative examples may be employed to make the information easy for customers to understand. The website may provide information about free shipping thresholds or special delivery options, like express or same-day delivery. It may also contain details about the courier partners and what procedures to follow in case of delayed shipment, lost package or if an incorrect item was delivered. Return and refund policies related to shipping might also be found on this page. Links to customer service or enquiry form could be present for users to contact in case of any issues or further questions.',
    'e-commerce customer reviews/testimonial':
      'The webpage primarily consists of consumer feedback on purchased products or services. This generally includes customer names, star ratings, content of the review, date of the review, and potentially images or videos submitted by the customers. The reviews range from highly positive to highly negative and touch on various aspects such as product quality, pricing, delivery speed, and customer service etc. There might also be an option for other customers to respond to or rate these reviews. Site administrators may respond publicly to reviews, especially negative ones, addressing the issues raised. This page may also feature categorization or a search bar to filter reviews by product category or keywords. A call-to-action button urging customers to leave their own review could be located prominently on the page.',
    'e-commerce gift cards':
      "The web page might contain various types of gift cards that are available for purchase. These could range from digital codes for online stores, to physical gift cards for popular retail brands. Each listing may contain an image of the card or a representative picture of what the gift card can be used for. Alongside with the image, there may be descriptive text mentioning the name of the retailer or service, value of the gift card, price, and details of delivery method (physical shipping or digital delivery).\n\nThe web page might also contain options to sort or filter the available gift cards by price, retailer name, card value, or popularity. There may also be a search bar to ease the process of selection. Customers' reviews and ratings on the gift cards can also be presented. \n\nThe page could contain an \"Add to Cart\" or \"Buy Now\" button for commitment to purchase, along with policies like return, refund, redeeming process etc. Additionally, user access functions such as log-in/sign-up options and shopping cart icon possibly exist. \n\nSince these are integral parts of the purchase journey, you may also find sections like \"Frequently Bought Together\" or \"You may also like\" showing other related gift card options or accessories. The webpage could also host promotional banners or discount offers on various gift cards. \n\nFinally, the page would likely contain the standard top or bottom navigation bar, providing links to other sections of the e-commerce website such as 'Home', 'Categories', 'Contact Us', 'About Us', and 'Policies'.",
    'e-commerce returns/refunds and exchanges':
      'The content of a web page belonging to the returns/refunds and exchanges category of an e-commerce website focuses on facilitating customers who are unsatisfied with their products or services and want to return or replace them. This may include policies for the return and exchange of items, conditions for a valid return or exchange, the process of requesting a return/exchange, refunds information, and a FAQ section. It could also include a contact section for customer service, providing assistance or collecting customer feedback related to returns, refunds, or exchanges of products. The web page may contain links to the returns form or application, step-by-step instructions for packing and shipping the items, and deadlines for returns. It might also provide information about item eligibility for returns which may vary based on the type of product (like clothes, electronics, perishables), its condition (damaged, wrong, or unsatisfactory item), and the time since purchase. Additionally, it’s likely to mention details about refund processing time and refund method - be it to the original payment method or a store credit.',
    'physical store address/location/direction':
      'The web page, under the category of physical store address/location/direction, would primarily feature detailed information about the physical location of the ecommerce business. This could include the full address of the store(s), along with the postal code or ZIP code. There might also be a detailed map or interactive GPS coordinates for easy direction finding. Information about store hours, parking facilities, wheelchair accessibility may also be present. Some companies might add descriptions or pictures of the store exterior and surrounding landmarks to make it easier for customers to find them. Contact details for reaching out in case of difficulties in finding the store might also be available. In some instances, there might be directions using public transportation or directions from well-known reference points.',
    'customer support and assistance/frequently asked questions':
      "This web page may primarily contain a list of commonly asked questions and corresponding answers pertaining to the ecommerce website's services, products, delivery, payments, returns, refunds, account management, privacy policy, and more. It could have a search feature or categorizations for easy navigation. The page could also offer direct contact details such as email, helpline numbers, or live chat for additional customer support. This page may feature tailored responses for popular goods or transaction issues. It might include precise instructions on how to use certain features of the ecommerce website, an interactive feature allowing users to rate the helpfulness of answers, and links guiding customers to related topics or pages.",
    'contact us/get a pricing quote':
      "The web page may contain information on ways to contact the company such as phone numbers, email addresses, or physical addresses. There will likely be business hours listed and different department contacts. It may also feature a contact form where users can enter their information and a personalized message to send directly to the company. Specific staff members like customer service representatives might be listed. For pricing quotes, there could be a separate form to request a quote, or guidance on how to get a quote for the products or services offered. Users may need to input specific details for accurate quotes, like the product they're interested in, quantity, etc. Additionally, this page might provide information on company's response time for contact requests and pricing quotes. This page may also include links to social media or FAQ sections for other information.",
    blog: "A web page in the blog category of an ecommerce website could contain a variety of content types, all aimed at engaging readers and indirectly promoting the website's products or services. This could include informative articles and how-to guides linked to the products or services sold on the website. The articles might discuss industry trends, advice and tips, or highlight new product features. The web page may feature product reviews, comparisons, or behind-the-scenes stories about the brand or merchandise. User-generated content like customer testimonials or success stories may also be included. Generally, blog posts aim to inspire, educate, or entertain readers, while subtly convincing them to make a purchase. The webpage might also have a comment section to facilitate interaction or share buttons for various social media platforms. The layout and design should be clean and engaging, possibly featuring relevant images, infographics, or videos.",
    'legal informations and terms and conditions':
      "The web page would include detailed information about the company’s legalities and regulations. It will have sections like Terms and Conditions, Privacy Policy, and User Agreement, that dictate the rules and procedures for using the website. The Terms and Conditions section would detail guidelines for website usage, the selling/payment/shipping procedures, return and refund policies, disclaimers for the responsibility of the seller, and copyright information. The Privacy Policy would describe how customer data is collected, managed, stored, shared, and protected, ensuring compliance with data privacy laws. It might also include cookie policies and user consent matters. The User Agreement section would outline users' rights and obligations when using the website, establishing a legal framework to protect both parties. This page may also include other necessary legal disclosures, such as business licenses, patents, or trademarks.",
    'information about the company':
      "The web page is likely to provide comprehensive and detailed information about the company. This could include the company's background, history and inception, mission, vision, and values, and general business model. It may also detail information about the team leading the company including their qualifications and experience, or feature a message from the CEO or the founder(s). It could provide insights about location(s) or branches of the company worldwide. Major milestones, achievements, awards, or certificates earned by the company might be listed. The page might also have information about company policies, investment details, partnerships and affiliations, press releases, job or career opportunities, and social responsibility initiatives. There could be links to other sections of the website like the company’s blog, products or services, and contact information.",
    'press material':
      'A press material web page on an e-commerce website typically contains information intended for members of the media and press. It might include press releases that announce new product launches, company mergers, partnerships, or other significant company news. The page could also have links to high-resolution product images, company logos, or executive headshots available for download. It could feature a media contact section with information about who to reach out to for press inquiries. Also, it may provide product fact sheets, executive bios, corporate fact sheets, and publicity articles or features. Some press material pages may also include a press kit, which is a comprehensive package of information about the company, its products, or services. There might also be links to notable past media coverage or a catalogue of press mentions.',
    'career opportunities':
      'A web page categorized under "career opportunities" on an ecommerce website would primarily present various job openings within the company. The page could have a detailed listing of available positions, neatly categorized by job roles, departments or locations. Each job role might be accompanied by a comprehensive description, including key responsibilities, qualifications required, experience level, and other specific skills preferred. \n\nThere might also be a search functionality to filter the job listings based on keywords, location, job type, etc. It could include an application portal for users to upload their resume or apply directly via LinkedIn or other platforms. \n\nAdditionally, the page may also contain information about the company\'s culture, values, benefits, and employee testimonials to attract potential candidates. It could also link to pages discussing internship opportunities, corporate training programs, or possibility of remote working. An FAQ section might be present to address common queries related to the recruitment process. \n\nThese elements help users to understand the work environment, evaluate the suitability of the roles and apply directly from the webpage.',
    'account login/register':
      'The web page mainly contains fields for customers to input their information in order to login or create a new account. For returning customers, there might be fields to input a username or email, along with a password. For new customers, there may be additional fields such as name, contact information, mailing address, and a field to create a new password. There could also be a password recovery option, usually in the form of "Forgot your password?" link. Other potential elements are "Remember Me" checkbox, social media login options, and a link to the Privacy Policy and Terms of Service. Visuals are typically minimal, focusing on a clean, easy-to-use interface. There is a clear call to action in the form of "Login" or "Register" buttons. Also, there might be security assurances such as lock icons, descriptions of data handling practices or links to more detailed privacy information.',
    other: 'other',
    'page not found':
      'A "Page Not Found" web page in an ecommerce website typically contains a message informing the user about the non-existence or unavailability of the requested page. It may contain phrases like "404 error", "Page not found", "The page you\'re looking for doesn\'t exist" or "We can\'t seem to find the page you\'re looking for". The page often includes a search bar to help users find alternate products or content, navigational links or buttons leading to the homepage or other significant pages of the site, and possibly some error-code information for troubleshooting. It may also feature simple explanatory graphics or gifs. Some sites use humor in their "Page Not Found" design to lighten the inconvenience of encountering a dead-end.',
  },
};
