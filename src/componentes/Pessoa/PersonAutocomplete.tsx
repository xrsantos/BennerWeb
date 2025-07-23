import React from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

export interface Person {
  id: number;
  nome: string;
  cpf: string;
}

/** Props do componente */
interface PersonAutocompleteProps {
  options: Person[];                       // Lista de pessoas
  value: Person | null;                    // Pessoa atualmente selecionada
  onChange: (pessoa: Person | null) => void;
  label?: string;                          // texto do label
  loading?: boolean;                       // exibe spinner no input
  disableClearable?: boolean;              // impede limpar seleção
}

export const PersonAutocomplete: React.FC<PersonAutocompleteProps> = ({
  options,
  value,
  onChange,
  label = 'Pessoa',
  loading = false,
  disableClearable = false
}) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={opt => `${opt.nome} — ${opt.cpf}`}
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
      noOptionsText="Nenhuma pessoa encontrada"
      fullWidth
    />
  );
};
