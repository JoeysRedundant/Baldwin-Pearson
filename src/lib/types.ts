export type Listing = {
  id: string;
  slug: string;
  title: string;
  city: string;
  status: 'For sale' | 'For lease' | 'Under contract' | 'Closed';
  type: string;
  price: string;
  sqft: string;
  units: string;
  description: string;
  images: string[];
  broker: string;
  featured: boolean;
  published: boolean;
  sourceUrl?: string;
};
export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  property: string;
  created_at: string;
  read: number;
  notification: string;
};
