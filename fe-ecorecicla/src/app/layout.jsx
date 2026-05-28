import { Roboto } from "next/font/google";
import "./globals.css";
import { ProveedorAutenticacion } from "@/context/ContextoAutenticacion";
import { ProveedorRegistro } from "@/context/ContextoRegistro";
import { RankingProvider } from "@/context/RankingContext"; // <- importa tu contexto

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Ecorecicla Web",
  description: "Proyecto web de Ecorecicla",
  icons: {
    icon: "/Eco-pestaña.png",
  },
};

export default function DisenoRaiz({ children }) {
  return (
    <html lang="es">
      <body className={roboto.className}>
        <RankingProvider>
          <ProveedorAutenticacion>
            <ProveedorRegistro>
              {children}
            </ProveedorRegistro>
          </ProveedorAutenticacion>
        </RankingProvider>
      </body>
    </html>
  );
}
