import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "react-oidc-context"


const clientIdAPI = import.meta.env.VITE_COGNITO_CLIENT_ID;

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_iR3Zsdplk",
  // this is located on Cognito > App clients > Clien ID section
  client_id: clientIdAPI,
  redirect_uri: "http://localhost:5173/",
  post_logout_redirect_uri: "http://localhost:5173/", // must match Allowed sign-out URLs
  response_type: "code",
  scope: "openid email phone",
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig}>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
)