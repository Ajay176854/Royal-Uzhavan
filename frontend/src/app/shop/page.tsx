import { Suspense } from 'react';
import { Metadata } from 'next';
import PageComponent from '../../screens/Shop';

export const metadata: Metadata = {
  title: "Shop Premium Animal Feeds | Kanyakumari & Tamil Nadu",
  description: "Browse our selection of premium cattle feed, poultry feed, pigeon mixes, and organic farm supplements. Direct from Kanyakumari farms to all over India.",
  keywords: ["Buy Cattle Feed", "Poultry Supplements Online", "Royal Uzhavan Shop", "Kanyakumari Farm Products", "Tamil Nadu Animal Feed"],
};

export default function Page() {
  return (
    <Suspense fallback={<div className='p-12 text-center'>Loading Shop...</div>}>
      <PageComponent />
    </Suspense>
  );
}

