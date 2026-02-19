# Agriconnect Design Guidelines

## Design Approach
**System-Based Approach** with agricultural marketplace adaptation. Drawing from Material Design principles for content-rich interfaces combined with marketplace patterns from established platforms like Etsy and Shopify. Prioritizes clarity, trustworthiness, and efficient task completion for agricultural users.

## Typography System

**Primary Font**: Inter or Roboto (Google Fonts CDN)
**Secondary Font**: Poppins for headings (optional accent)

**Hierarchy:**
- Hero Headlines: 3xl to 5xl, font-weight-700
- Section Headers: 2xl to 3xl, font-weight-600
- Card Titles: lg to xl, font-weight-600
- Body Text: base, font-weight-400
- Labels/Meta: sm, font-weight-500
- Buttons: base, font-weight-600, uppercase tracking-wide

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, and 12
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-16 (mobile), py-16 to py-24 (desktop)
- Card gaps: gap-4 to gap-6
- Form field spacing: space-y-4

**Container Strategy:**
- Max-width: max-w-7xl for main content
- Dashboard grids: max-w-screen-2xl for data tables
- Forms: max-w-2xl centered

## Core Components

### Navigation
**Farmer/Customer Dashboards:**
- Persistent sidebar navigation (w-64) with icons from Heroicons
- Top bar: User profile dropdown, notifications bell, quick actions
- Mobile: Collapsible hamburger menu with slide-out drawer

**Main Navigation Items:**
- Dashboard overview (grid icon)
- Vehicles (truck icon)
- Produce (leaf/plant icon)
- Pesticides (beaker icon)
- Orders (clipboard icon)
- Profile (user icon)
- Support (question mark icon)

### Cards & Listings

**Vehicle Cards:**
- Image aspect ratio: 4:3
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card structure: Image top, title, specs (4-5 key details), availability badge, price, action button
- Include: Vehicle type, capacity, daily rate, location, availability status

**Produce Listings:**
- Mixed layout: Featured items in 2-column, standard grid in 3-4 columns
- Display: Product image, name, price/kg, quantity available, farmer name, "Add to Cart" button
- Category filters in sticky sidebar

**Pesticide Products:**
- Standard e-commerce grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Compact cards: Image, brand, product name, size/volume, price, stock indicator

### Forms & Inputs

**Listing Forms (Add Vehicle/Produce):**
- Two-column layout on desktop (form left, preview right)
- Image upload area: Large drag-drop zone with thumbnail previews
- Input fields: Consistent h-12 with rounded borders
- Required field indicators: Asterisk in label
- Help text: text-sm below inputs
- Submit buttons: Full-width on mobile, auto-width on desktop

**Authentication:**
- Centered card (max-w-md) on plain background
- Farmer ID input prominently featured with unique identifier icon
- "Remember me" checkbox, "Forgot ID?" link
- Clear visual separation for Farmer vs Customer login paths

### Dashboard Components

**Overview Cards:**
- Stats grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Each stat card: Large number (3xl), label, trend indicator (arrow icon), mini-chart placeholder

**Order Tracking:**
- Timeline-style layout with vertical line connecting stages
- Status badges with icons: Pending, Confirmed, In Transit, Completed, Cancelled
- Expandable order details on click

**Tables:**
- Responsive with horizontal scroll on mobile
- Striped rows for readability
- Action buttons in rightmost column
- Sortable headers with arrow indicators

### Marketplace Features

**Search & Filters:**
- Search bar: Prominent, full-width on mobile, w-96 on desktop
- Filter sidebar (w-64): Collapsible panels for categories, price range, location, availability
- Active filter chips above results with dismiss icons

**Shopping Cart/Booking Summary:**
- Sticky sidebar on desktop, bottom sheet on mobile
- Item list with thumbnails, quantities, remove buttons
- Subtotal calculation
- Prominent checkout button

### Email Confirmation Display
After successful transaction, show confirmation screen:
- Large checkmark icon centered
- Order/booking number prominently displayed
- "Email sent to [address]" message
- Summary of transaction details
- "View Orders" and "Continue Shopping" buttons

## Images

**Hero Section:**
Large hero image spanning full-width (h-96 md:h-screen max-h-[600px])
- Image: Agricultural landscape showing farmers working in fields with modern equipment, sunrise/golden hour lighting
- Overlay: Semi-transparent gradient from bottom
- Content: Centered headline "Connecting Agricultural Communities", subheadline, dual CTAs ("For Farmers" and "For Customers") with blurred button backgrounds

**Dashboard Images:**
- Empty states: Illustrations of relevant items (tractor, produce, etc.)
- Profile avatars: Circular, 10-12 for small, 24 for large
- Product/vehicle images: Real photos, not illustrations

**Marketplace Imagery:**
- Vehicle listings: Actual farm equipment photos from multiple angles
- Produce items: High-quality product photography on neutral backgrounds
- Pesticide products: Product packaging shots

**Additional Imagery:**
- Customer care section: Photo of support team or agricultural consultants
- About/Trust section: Photos of real farmers using the platform
- Testimonials: Farmer profile photos (circular, medium size)

## Accessibility & Interaction

- Focus states: 2px ring with offset for all interactive elements
- Button states: Slight scale transform, no elaborate animations
- Loading states: Skeleton screens for cards, spinner for buttons
- Error states: Inline validation messages below form fields
- Toast notifications: Top-right corner for system messages (booking confirmations, errors)

## Page Structure

**Landing Page:**
5-6 sections: Hero, Features (3-column grid), How It Works (timeline/steps), Categories Showcase (vehicle/produce/pesticide cards), Testimonials (2-3 column), CTA + Footer

**Dashboards:**
Sidebar navigation + main content area with breadcrumbs, page title, action buttons in header, content grid below

**Profile Management:**
Tabbed interface: Personal Info, Business Details, Payment Methods, Notification Preferences

**Customer Care:**
FAQ accordion + Contact form (2-column: form + contact info with email, phone, hours)