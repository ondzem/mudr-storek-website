import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import PricingPage from './pages/PricingPage';
import StaffPage from './pages/StaffPage';
import AppointmentPage from './pages/AppointmentPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import OrdinacePage from './pages/OrdinacePage';
import HolidaysPage from './pages/HolidaysPage';
import CancelBookingPage from './pages/CancelBookingPage';
import OfficeHoursPage from './pages/OfficeHoursPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="kontakt" element={<ContactPage />} />
        <Route path="fotogalerie" element={<GalleryPage />} />
        <Route path="cenik" element={<PricingPage />} />
        <Route path="personal" element={<StaffPage />} />
        <Route path="objednani" element={<AppointmentPage />} />
        <Route path="ordinacni-hodiny" element={<OfficeHoursPage />} />
        <Route path="informace" element={<OrdinacePage />} />
        <Route path="dovolene" element={<HolidaysPage />} />
        <Route path="ochrana-osobnich-udaju" element={<PrivacyPolicyPage />} />
        <Route path="obchodni-podminky" element={<TermsPage />} />
        <Route path="zrusit" element={<CancelBookingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;