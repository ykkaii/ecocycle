import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AddListingPage } from './pages/AddListingPage';
import { EditListingPage } from './pages/EditListingPage';
import { RecyclingPage } from './pages/RecyclingPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog/raw" element={<CatalogPage kind="raw" />} />
          <Route path="/catalog/products" element={<CatalogPage kind="product" />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add" element={<AddListingPage />} />
          <Route path="/edit/:kind/:id" element={<EditListingPage />} />
          <Route path="/recycling" element={<RecyclingPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;