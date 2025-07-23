import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { type FormaPagamento } from "../../types/Pedido";


interface Props {
  value: FormaPagamento;
  onChange: (value: FormaPagamento) => void;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}


const labelMap: Record<number, string> = {
  [1]: 'Dinheiro',
  [3]: 'Cartão',
  [6]: 'Boleto'
};

const options: number[] = [
  1,
  3,
  6
];


export const FormaPagamentoSelect: React.FC<Props> = ({
  value,
  onChange,
  label = 'Forma de pagamento',
  disabled = false,
  fullWidth = true,
  size = 'small'
}) => {
  const handleChange = (e: SelectChangeEvent<unknown>) =>
    onChange(e.target.value as FormaPagamento);

  return (
    <FormControl fullWidth={fullWidth} size={size} disabled={disabled}>
      <InputLabel id="forma-pagamento-label">{label}</InputLabel>
      <Select
        labelId="forma-pagamento-label"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>
            {labelMap[opt]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};