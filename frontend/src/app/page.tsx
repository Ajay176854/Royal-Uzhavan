import { Metadata } from 'next';
import Home from '../screens/Home';

export const metadata: Metadata = {
  title: "Premium Animal Feeds in Kanyakumari & Tamil Nadu",
  description: "Royal Uzhavan offers premium cattle, poultry, and bird feeds directly from our farms in Kanyakumari. Serving all over Tamil Nadu and India.",
};

export default function Page() {
  return <Home />;
}

