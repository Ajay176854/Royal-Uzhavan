import { Metadata } from 'next';
import PageComponent from '../../screens/Contact';

export const metadata: Metadata = {
  title: "Contact Royal Uzhavan | Kanyakumari",
  description: "Get in touch with Royal Uzhavan. We are located at 2/11/9, Asaarivilai, Saral post, Kanyakumari District, Tamil Nadu. Call us at +91 80-72864890 for premium animal feeds.",
  keywords: ["Contact Royal Uzhavan", "Kanyakumari Feed Supplier", "Tamil Nadu Animal Feed Contact", "Buy Cattle Feed Wholesale"],
};

export default function Page() {
  return <PageComponent />;
}
