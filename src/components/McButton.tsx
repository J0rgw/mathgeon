import "../styles/mc.css";

interface McButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
  type?: "submit" | "button";
  className?: string;
}

export default function McButton({
  children,
  onClick,
  full = true,
  type = "button",
  className = "",
}: McButtonProps) {
  return (
    <button
      className={`mc-button ${full ? "full" : ""} ${className}`}
      onClick={onClick}
      type={type}
    >
      <div className="title">{children}</div>
    </button>
  );
}
    