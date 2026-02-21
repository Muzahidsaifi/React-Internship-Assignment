import { useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (count: number) => void;
}

const CustomSelectionOverlay: React.FC<Props> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [value, setValue] = useState<number | null>(null);

  if (!visible) return null;

  return (
    <div className="overlay">
      <div className="overlay-box">
        <h3>Select Number of Rows</h3>

        <InputNumber
          value={value}
          onValueChange={(e) => setValue(e.value ?? null)}
          placeholder="Enter number"
          min={1}
        />

        <div className="overlay-buttons">
          <Button
            label="Confirm"
            onClick={() => {
              if (value && value > 0) {
                onConfirm(value);
                setValue(null);
              }
            }}
          />
          <Button
            label="Cancel"
            severity="secondary"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomSelectionOverlay;