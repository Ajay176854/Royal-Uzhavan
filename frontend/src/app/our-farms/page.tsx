import { Metadata } from 'next';
import PageComponent from '../../screens/OurFarms';

export const metadata: Metadata = {
  title: "Our Farms in Kanyakumari | Royal Uzhavan",
  description: "Learn about Royal Uzhavan's traditional farms in Saral post, Kanyakumari. We produce 100% natural, high-quality animal feeds for Tamil Nadu and beyond.",
  keywords: ["Kanyakumari Farms", "Traditional Farming Tamil Nadu", "Natural Animal Feed Production", "Royal Uzhavan Farms", "Saral post Kanyakumari"],
};

export default function Page() {
  return <PageComponent />;
}
