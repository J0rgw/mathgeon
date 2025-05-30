import "../styles/mc.css";

interface McInputProps {
    id?: string,
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: "text" | "password" | "email";
  }
  
  export default function McInput({ id, placeholder, value, onChange, type = "text" }: McInputProps) {
    return (
      <input
        id={id}
        className="mc-input mc-button full"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }
  
