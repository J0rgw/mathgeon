import "../styles/book.css";
import "./LayoutContent.css"; // Estilos comunes para contenido
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  rightContent?: ReactNode; // Para mostrar texto extra en la derecha (opcional)
}

export default function BookLayout({ children, rightContent }: Props) {
  return (
    <div className="container">
      <div className="sprite-wrapper">
        <div className="book">
          <div className="carousel" style={{ "--slides": "1" } as React.CSSProperties}>
            <div className="sprite" />
            <div className="carousel-item">
              <div className="page-container">
                <div className="page left-page">
                  <div className="layout-left">{children}</div>
                </div>
                <div className="page right-page">
                  <div className="layout-right">{rightContent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
