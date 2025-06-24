// RoleSelect.tsx
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const rolesMap = {
  A: 'Administrador',
  P: 'Pessoa',
  O: 'Organizador',
};

export function RoleSelect({ value, onChange, roles = ['A', 'P', 'O'] }) {
  return (
    <Select value={value ?? ''} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        {/* Mostrar o texto do role selecionado */}
        <SelectValue placeholder="Selecione a role">
          {rolesMap[value] || 'Selecione a role'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Funções</SelectLabel>
          {roles.map((role) => (
            <SelectItem key={role} value={role}>
              {rolesMap[role]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
