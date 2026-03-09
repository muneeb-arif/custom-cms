# Next.js CMS

A modern, flexible Content Management System built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- **Dynamic Pages**: Create and manage pages with flexible sections
- **Section System**: Multiple section types (Text+Image, Image Slider, Heading+Paragraph)
- **Services Management**: Full CRUD for services with listing and detail views
- **Admin Dashboard**: WordPress-like admin interface for content management
- **SEO Optimized**: Dynamic metadata, sitemap generation, and ISR support
- **Authentication**: Secure admin access with NextAuth.js
- **Modern UI**: Clean, minimal design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Vercel Postgres recommended)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20.19+, 22.12+, or 24.0+
- PostgreSQL database (or Vercel Postgres)
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cms?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Public URL for sitemap
NEXT_PUBLIC_URL="http://localhost:3000"
```

3. Set up the database:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

4. Create an admin user:

You'll need to create an admin user manually in the database. You can use Prisma Studio:

```bash
npm run db:studio
```

Or create a seed script to add a default admin user.

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cms/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── page.tsx      # Home page
│   │   ├── about/        # About page
│   │   ├── services/     # Services pages
│   │   └── [...slug]/    # Dynamic pages
│   ├── (admin)/          # Admin routes (protected)
│   │   └── admin/        # Admin dashboard
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/
│   ├── public/           # Public components
│   └── admin/            # Admin components
├── lib/
│   ├── db/               # Database client
│   └── auth.ts           # NextAuth config
├── prisma/
│   └── schema.prisma     # Database schema
└── types/
    └── cms.ts            # TypeScript types
```

## Database Schema

The CMS uses the following main models:

- **User**: Admin users for authentication
- **Page**: Dynamic pages with sections
- **Section**: Flexible content sections
- **Service**: Service listings and details

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add Vercel Postgres database
4. Set environment variables in Vercel dashboard
5. Deploy!

The `DATABASE_URL` will be automatically provided by Vercel Postgres.

### Environment Variables for Production

Make sure to set:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: A secure random string
- `NEXTAUTH_URL`: Your production URL
- `NEXT_PUBLIC_URL`: Your production URL (for sitemap)

## Usage

### Creating Pages

1. Log in to the admin dashboard at `/admin/login`
2. Navigate to "Pages" in the sidebar
3. Click "Create New Page"
4. Fill in the page details (slug, title, metadata)
5. Save the page
6. Add sections to the page (Text+Image, Image Slider, etc.)

### Managing Services

1. Go to "Services" in the admin dashboard
2. Click "Create New Service"
3. Fill in service details
4. Services will appear on the public `/services` page

### Section Types

Currently supported section types:
- **TextImage**: Text with an image (left or right alignment)
- **ImageSlider**: Image carousel/slider
- **HeadingParagraph**: Heading with multiple paragraphs

More section types can be added by extending the section renderer system.

## Development

### Database Migrations

```bash
# Create a new migration
npm run db:migrate

# Apply migrations
npm run db:push
```

### Prisma Studio

View and edit your database:

```bash
npm run db:studio
```

## License

MIT
