import { z } from 'zod';
const text = (max: number) => z.string().trim().max(max);
export const inquirySchema = z.object({
  name: text(100).min(2, 'Please enter your name.'),
  email: z.email('Enter a valid email address.').max(254),
  phone: text(40),
  interest: z.enum([
    'Buying',
    'Selling',
    'Leasing',
    'Appraisal',
    'General inquiry',
    'Property updates',
  ]),
  message: text(5000).min(10, 'Please add a little more detail (at least 10 characters).'),
  property: text(200).default(''),
  website: text(200).default(''),
  consent: z.literal(true, { error: 'Please consent to being contacted.' }),
});
export const listingSchema = z.object({
  id: text(100).regex(/^[a-z0-9-]+$/),
  slug: text(120).regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Use lowercase letters, numbers, and hyphens.',
  ),
  title: text(180).min(3),
  city: text(80).min(2),
  status: z.enum(['For sale', 'For lease', 'Under contract', 'Closed']),
  type: z.enum([
    'Mixed use',
    'Multifamily',
    'Industrial',
    'Office',
    'Retail',
    'Commercial',
    'Development',
    'Religious facility',
  ]),
  price: text(100).min(1),
  sqft: text(80),
  units: text(80),
  description: text(20000).min(20),
  images: z
    .array(
      z
        .string()
        .regex(
          /^\/(?:images\/[a-zA-Z0-9_.-]+|api\/media\/[a-zA-Z0-9_.-]+)$/,
          'Upload an image or use a local image path.',
        ),
    )
    .min(1)
    .max(20),
  broker: z.enum(['Daniel Shawah', 'George Shawah']),
  featured: z.boolean(),
  published: z.boolean(),
  sourceUrl: z.url().optional(),
});
