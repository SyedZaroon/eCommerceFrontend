import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/generalPages.css"
import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import OfferPage from "./pages/offerPage/OfferPage"
import ContactUs from "./pages/contactPage/ContactUs"
import Privacy from "./pages/privacyPage/Privacy";
import Terms from "./pages/terms/Terms";
import Error from "./pages/errorPage/Error";
import AboutPage from "./pages/aboutPage/AboutPage";
import ThankYouPage from "./pages/thankYouPage/ThankYouPage";
import Checkout from './pages/checkout/Checkout'
import CartDrawer from "./components/cartDrawer/cartDrawer";
import CollectionPage from "./Pages/collectionPage/CollectionPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
            {
        path: "/collection/:collectionName",
        element: <CollectionPage />,
      },
      {
        path: "/product/:model",
        element: <OfferPage />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/privacy-policy",
        element: <Privacy />,
      },
      {
        path: "/terms-conditions",
        element: <Terms />,
      },
      {
        path: "/about-us",
        element: <AboutPage />,
      },
      {
        path: "/thankyou",
        element: <ThankYouPage />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
