'use client';

import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { ArrowUpDown, Calendar, ChevronDown, Eye, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

export default function CustomTable({ data, columns: userColumns, actions = [] }) {
  // Coluna do checkbox para seleção
  const checkboxColumn = {
    id: 'checkbox',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar tudo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  // Coluna de ações com dropdown menu dinâmico
  const actionsColumn = {
    id: 'acoes',
    enableSorting: false,
    enableHiding: false,

    cell: ({ row }) => {
      const rowData = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 text-white">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            {actions.length === 0 && (
              <DropdownMenuItem disabled>Nenhuma ação configurada</DropdownMenuItem>
            )}

            {actions.map(({ label, icon: Icon, onClick }, i) => (
              <div key={i}>
                {i > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={() => onClick(rowData)}
                  className="flex items-center gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {label}
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  // Juntando colunas
  const columns = [checkboxColumn, ...userColumns, actionsColumn];

  // States
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) =>
      String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase()),
  });

  return (
    <div className="bg-[var(--color-dark)] max-h-screen text-white px-6 py-6 mt-10 mx-5 flex justify-center rounded-3xl">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Buscar por qualquer campo..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="bg-white text-black placeholder-gray-600 w-full sm:w-80"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-black bg-white hover:bg-gray-200 w-full sm:w-auto"
              >
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Versão Desktop */}
        <div className="hidden sm:block overflow-x-auto border border-white/10 rounded-md shadow-sm overflow-y-auto max-h-[calc(100dvh-6rem)]">
          <Table className="table-fixed min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-white/10">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-white/80 text-left px-4 py-2 whitespace-normal break-words cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() &&
                            ({
                              asc: <ArrowUpDown className="h-4 w-4 rotate-180" />,
                              desc: <ArrowUpDown className="h-4 w-4" />,
                            }[header.column.getIsSorted()] ?? (
                              <ArrowUpDown className="h-4 w-4 opacity-50" />
                            ))}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b border-white/10">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-2 max-w-[200px] truncate overflow-hidden whitespace-nowrap"
                        title={
                          !['checkbox', 'acoes'].includes(cell.column.id) &&
                          (typeof cell.getValue() === 'string' ||
                            typeof cell.getValue() === 'number')
                            ? String(cell.getValue())
                            : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-10">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Paginação + Contador de Seleção */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 text-white text-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Página Anterior
            </Button>
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima Página
            </Button>
          </div>

          <div>
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>

          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              className="bg-white text-black rounded px-2 py-1"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span>registros</span>
          </div>

          <div className="text-right">
            {table.getFilteredSelectedRowModel().rows.length} de{' '}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
        </div>
        {/* Versão Mobile */}
        <div className="block sm:hidden max-h-[calc(100dvh-6rem)] h-[100vw] overflow-y-auto space-y-4">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const rowData = row.original;
              const visibleColumns = table
                .getAllColumns()
                .filter((col) => col.getIsVisible() && col.id !== 'checkbox' && col.id !== 'acoes');

              return (
                <article
                  key={row.id}
                  className="bg-[var(--color-dark-light)] rounded-lg p-5 shadow-md border border-white/20"
                  role="group"
                  aria-labelledby={`row-${row.id}-title`}
                >
                  <header className="flex items-center justify-between mb-4">
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Selecionar linha"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-white">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        {actions.length === 0 ? (
                          <DropdownMenuItem disabled>Nenhuma ação configurada</DropdownMenuItem>
                        ) : (
                          actions.map(({ label, icon: Icon, onClick }, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && <DropdownMenuSeparator />}
                              <DropdownMenuItem
                                onClick={() => onClick(rowData)}
                                className="flex items-center gap-2"
                              >
                                {Icon && <Icon className="h-4 w-4" />}
                                {label}
                              </DropdownMenuItem>
                            </React.Fragment>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </header>

                  <dl className="grid grid-cols-1 gap-y-3">
                    {visibleColumns.map((column) => {
                      const cell = row.getVisibleCells().find((c) => c.column.id === column.id);
                      if (!cell) return null;
                      return (
                        <div key={column.id} className="flex flex-col">
                          <dt className="text-xs font-semibold text-white/70 capitalize mb-1">
                            {column.id}
                          </dt>
                          <dd
                            className="text-sm text-white truncate max-w-full"
                            title={String(cell.getValue())}
                          >
                            {flexRender(
                              column.columnDef.cell ?? column.columnDef.header,
                              cell.getContext()
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </article>
              );
            })
          ) : (
            <p className="text-center py-10 text-white/80">Nenhum resultado encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
