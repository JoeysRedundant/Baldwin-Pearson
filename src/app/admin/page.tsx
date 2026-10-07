import { isAdmin } from '@/lib/security';
import { getListings, getInquiries } from '@/lib/db';
import { AdminLogin } from '@/components/admin-login';
import { AdminDashboard } from '@/components/admin-dashboard';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Team workspace', robots: { index: false, follow: false } };
export default async function Admin() {
  const authenticated = await isAdmin();
  return (
    <section className="shell admin-wrap">
      {authenticated ? (
        <AdminDashboard listings={getListings(true)} inquiries={getInquiries()} />
      ) : (
        <AdminLogin />
      )}
    </section>
  );
}
