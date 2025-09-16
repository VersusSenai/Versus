import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { useDataTableContext } from '../context/useDataTableContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ChevronDown, MoreHorizontal, SortAsc, SortDesc } from 'lucide-react';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

/**
 * Props do componente DataTable.
 *
 */

/**
 * Tabela genérica com paginação, ordenação, filtros e visibilidade de colunas
 * controlada pelo nível de acesso do usuário.
 *
 */
export default function DataTable({ data, columns: TableColumns, actions = [] }) {
  const { pageIndex, setPageIndex, filter } = useDataTableContext();

  // Estado interno para sorting, filtros e visibilidade de colunas
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

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

  const checkboxColumn = {
    id: 'checkbox',
    header: ({ table }) => (
      <div className="w-full flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar tudo"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-full flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const columns = [checkboxColumn, ...TableColumns, actionsColumn];

  // Configura o React Table com todas as funcionalidades necessárias
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
    autoResetPageIndex: false, // resetar página ao filtrar/ordenar
    enableColumnResizing: true, // permitir redimensionar colunas
    initialState: {
      pagination: { pageSize: 25 }, // tamanho da página inicial
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

  // Sincroniza o índice de página do React Table com o contexto externo
  useEffect(() => {
    table.setPageIndex(pageIndex);
  }, [pageIndex]);

  // Ao montar, garante que a página comece em 0
  useEffect(() => {
    setPageIndex(0);
  }, []);

  // Se o filtro global for "clear", reseta todos os filtros de coluna
  useEffect(() => {
    if (filter === 'clear') {
      table.resetColumnFilters();
    }
  }, [filter]);

  return (
    <div className="flex flex-col rounded-md overflow-auto border gap-2 p-4 m-4 bg-dark/90">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 flex-wrap">
        <Input
          placeholder="Buscar por qualquer campo..."
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="sm:w-80 duration-300 border-b-[1px] border-[var(--color-2)] focus-visible:ring-0 focus-visible:border-[var(--color-2)] focus-visible:bg-1/10 placeholder:text-gray-400 text-white"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
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
                  {column.columnDef.header}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 w-full overflow-auto">
        <ScrollArea className="rounded-md">
          <ScrollBar orientation="vertical" />
          <Table>
            {/* Cabeçalho da tabela */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-1/20 hover:bg-1/20 ">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-gray-300"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1 p-2 m-1 hover:bg-1/10 rounded-md cursor-pointer">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() &&
                            ({
                              asc: <SortAsc size={16} />,
                              desc: <SortDesc size={16} />,
                            }[header.column.getIsSorted()] ?? <ArrowUpDown size={16} />)}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Corpo da tabela */}
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-1/10 h-16">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-gray-100 p-2"
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
                // Mensagem quando não há resultados
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center p-8">
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Rodapé com contagem e paginação */}
      </div>
      <div className="relative py-2 flex items-center sm:justify-between justify-center border-t border-white/10 flex-wrap gap-2">
        {/* Total de registros exibidos */}
        <span className="text-sm text-gray-300">
          Total de registros: {table.getFilteredRowModel().rows.length}
        </span>

        {/* Controles de navegação de páginas */}
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          <Button variant="secondary" disabled>
            {pageIndex + 1} de {table.getPageCount()}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
        <div className="text-sm text-gray-300">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
      </div>
    </div>
  );
}
