## Todos

#### Features

- [ ] Change the default currency to INR everywhere on the app (for all screens, all components, all mockups, and all the data). Make sure to change the currency symbol to ₹ as well.
- [ ] Add more currencies to choose for default currency (also add country flags for each currency)
- [ ] Add condition to prevent duplicate subscriptions
- [ ] The app is called "Payfool". Change all the branding to "Payfool" (including the app name, logo, and everywhere else in the app)
- [ ] Update the meta tags for all the pages to make it very SEO friendly (including the title, description, and other important meta tags)
- [ ] Create an opengraph image for the app and add it to the meta tags for all the pages (1200x630px, 1.91:1 ratio, PNG format). The image should match the branding of the app and should be visually appealing. It should also include the app name and logo in a prominent way.
- [ ] Change the logo and favicon to match the branding of the app (Payfool)
- [ ] On the settings page, changing preferences doesn't show toast messages.
- [ ] Make sure all the money related updates are reflected actually and not just for mockup.
- [ ] For the brands where there icon isnt available,use uncolored icons of those. For eg, you said amazon icon isn't available, but there are versions available when I check react-icons library.
- [ ] Also, I don't want the wide hyphen "—" anywhere on the app that is usually given by AI tools.
- [ ] Implement lightweight auth flow in the app so each user can have their own version of the app with their own data.
- [ ] For data storage, use a lightweight DB. This won't be a production app, it's just a fun little side project/product for me which may not have a lot users. Try Supabase if that fits well otherwise pick something yourself.
- [ ] Since we'll have a auth signin/signup, we'll need a nice looking landing page since all the current pages become protected. So create that following the same look and feel but should be very modern looking.
- [ ] Also have a guest login with mock data for people to play around and test the app as not everyone likes to login. Obv the guests login people would not have all the rights.
- [ ] Do a thorough testing of the app and make sure that everything that you'd expect to work, does work and there are no bugs here and there.
- [ ] After login, the settings and preferences should also have some user related configurations as well like name and other common stuff.
- [ ] Add more categories for subscriptions
- [ ] For all the stuff that needs some setup from my side like secret keys, etc., prepare a step by step instructions for the setup with the latest versions so there's no outdated issue and put all this in a new file guide.md. They should as detailed as possible.
- [ ] Also update the project readme as well.
- [ ] List down the next steps as a separate section in this file. Do not modify any item already present here. Only I will mark them once I finish my testing.

#### Bug Fixes

- [ ] Fix the scroll for the brand icons tab. Not able to scroll right now, there is a lag.
- [ ] There is a slight glitch of the icons when we switch from grid to list view and vice versa. Fix that glitch.
- [ ] When I'm adding a subscription, the default cycle is monthly and so the renewal date is set to 1 month from the current date. But when I change the cycle to yearly, the renewal date is still set to 1 month from the current date. It should be set to 1 year from the current date when I change the cycle to yearly. Fix this issue. Same for quarterly.
- [ ] Go through all the files one by one and check for typescript or linting issues and fix them. Then check those files again as sometimes the issues do not get fixed. And once it's fixed and nothing is breaking only then proceed.
- [ ] Remove all the unnecessary comments from everywhere. Only add comments where absolutely needed.
