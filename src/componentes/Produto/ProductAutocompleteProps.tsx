import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import type { Produto } from '../../types/Produtos';



/** Props do componente */
interface ProductAutocompleteProps {
  options: Produto[];                       // Lista de pessoas
  value: Produto | null;                    // Pessoa atualmente selecionada
  onChange: (pessoa: Produto | null) => void;
  label?: string;                          // texto do label
  loading?: boolean;                       // exibe spinner no input
  disableClearable?: boolean;              // impede limpar seleção
}

export const ProductAutocomplete: React.FC<ProductAutocompleteProps> = ({
  options,
  value,
  onChange,
  label = 'Produto',
  loading = false,
  disableClearable = false
}) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={opt => `${opt.nome} — ${opt.codigo}`}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      disableClearable={disableClearable}
      noOptionsText="Nenhum produto encontrado"
      fullWidth
    />
  );
};
