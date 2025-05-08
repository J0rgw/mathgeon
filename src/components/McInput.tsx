import "../styles/mc.css";

interface McInputProps {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: "text" | "password" | "email";
  }
  
  export default function McInput({ placeholder, value, onChange, type = "text" }: McInputProps) {
    return (
      <input
        className="mc-input mc-button full"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }
  
