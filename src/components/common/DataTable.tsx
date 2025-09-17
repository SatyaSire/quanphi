import React, { useState, useCallback } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
}

export interface TableAction<T = any> {
  key: string;
  label: string | ((record: T) => string);
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (record: T) => void;
  disabled?: (record: T) => boolean;
  hidden?: (record: T) => boolean;
  variant?: 'default' | 'danger';
}

export interface BulkAction<T = any> {
  key: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (selectedRecords: T[]) => void;
  variant?: 'default' | 'danger';
}

export interface PaginationInfo {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

export interface SortInfo {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterInfo {
  [key: string]: any;
}

interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSortChange?: (sort: SortInfo | null) => void;
  onFilterChange?: (filters: FilterInfo) => void;
  onSearch?: (searchText: string) => void;
  rowActions?: TableAction<T>[];
  bulkActions?: BulkAction<T>[];
  rowKey: string | ((record: T) => string);
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedRows: string[]) => void;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  rowClassName?: (record: T, index: number) => string;
}

const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  onPaginationChange,
  onSortChange,
  onFilterChange,
  onSearch,
  rowActions = [],
  bulkActions = [],
  rowKey,
  selectable = false,
  selectedRows: externalSelectedRows,
  onSelectionChange,
  searchPlaceholder = 'Search...',
  emptyText = 'No data available',
  className = '',
  rowClassName,
}: DataTableProps<T>) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<Set<string>>(new Set());
  
  // Use external selectedRows if provided, otherwise use internal state
  const selectedRows = externalSelectedRows ? new Set(externalSelectedRows) : internalSelectedRows;
  const setSelectedRows = (newSelection: Set<string>) => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelection));
    } else {
      setInternalSelectedRows(newSelection);
    }
  };
  const [searchText, setSearchText] = useState('');
  const [sortInfo, setSortInfo] = useState<SortInfo | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterInfo>({});

  const getRowKey = useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return record[rowKey] || index.toString();
    },
    [rowKey]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allKeys = data.map((record, index) => getRowKey(record, index));
        setSelectedRows(new Set(allKeys));
      } else {
        setSelectedRows(new Set());
      }
    },
    [data, getRowKey]
  );

  const handleSelectRow = useCallback(
    (key: string, checked: boolean) => {
      const newSelectedRows = new Set(selectedRows);
      if (checked) {
        newSelectedRows.add(key);
      } else {
        newSelectedRows.delete(key);
      }
      setSelectedRows(newSelectedRows);
    },
    [selectedRows]
  );

  const handleSort = useCallback(
    (column: Column<T>) => {
      if (!column.sortable) return;

      let newSortInfo: SortInfo | null = null;
      if (!sortInfo || sortInfo.field !== column.dataIndex) {
        newSortInfo = { field: column.dataIndex, order: 'asc' };
      } else if (sortInfo.order === 'asc') {
        newSortInfo = { field: column.dataIndex, order: 'desc' };
      }

      setSortInfo(newSortInfo);
      onSortChange?.(newSortInfo);
    },
    [sortInfo, onSortChange]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleFilterChange = useCallback(
    (key: string, value: any) => {
      const newFilters = { ...filters, [key]: value };
      if (!value) {
        delete newFilters[key];
      }
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, onFilterChange]
  );

  const selectedRecords = data.filter((record, index) =>
    selectedRows.has(getRowKey(record, index))
  );

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortInfo?.field === column.dataIndex;
    const isAsc = isActive && sortInfo?.order === 'asc';
    const isDesc = isActive && sortInfo?.order === 'desc';

    return (
      <span className="ml-1 flex flex-col">
        <ChevronUpIcon
          className={`h-3 w-3 ${isAsc ? 'text-primary-600' : 'text-gray-400'}`}
        />
        <ChevronDownIcon
          className={`h-3 w-3 -mt-1 ${isDesc ? 'text-primary-600' : 'text-gray-400'}`}
        />
      </span>
    );
  };

  const renderRowActions = (record: T) => {
    const visibleActions = rowActions.filter(
      (action) => !action.hidden?.(record)
    );

    if (visibleActions.length === 0) return null;

    return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="p-1 rounded-md hover:bg-gray-100">
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
        </Menu.Button>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {visibleActions.map((action) => (
              <Menu.Item key={action.key}>
                {({ active }) => (
                  <button
                    onClick={() => action.onClick(record)}
                    disabled={action.disabled?.(record)}
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } ${
                      action.variant === 'danger'
                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    } group flex w-full items-center px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150`}
                  >
                    {action.icon && (
                      <action.icon className="mr-3 h-4 w-4" />
                    )}
                    {typeof action.label === 'function' ? action.label(record) : action.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    );
  };

  return (
    <div className={`bg-white shadow-sm rounded-lg ${className}`}>
      {/* Header with search and filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Bulk actions */}
          {selectedRows.size > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {selectedRows.size} selected
              </span>
              {bulkActions.map((action) => (
                <button
                  key={action.key}
                  onClick={() => action.onClick(selectedRecords)}
                  className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                    action.variant === 'danger'
                      ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter inputs */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns
              .filter((col) => col.filterable)
              .map((column) => (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.title}
                  </label>
                  <input
                    type="text"
                    placeholder={`Filter by ${column.title.toLowerCase()}`}
                    value={filters[column.dataIndex] || ''}
                    onChange={(e) =>
                      handleFilterChange(column.dataIndex, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
              {rowActions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeleton
              Array.from({ length: pagination?.pageSize || 10 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {selectable && (
                    <td className="px-6 py-4">
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                  {rowActions.length > 0 && (
                    <td className="px-6 py-4">
                      <div className="h-4 w-8 bg-gray-200 rounded ml-auto"></div>
                    </td>
                  )}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (rowActions.length > 0 ? 1 : 0)
                  }
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRows.has(key);
                const customRowClass = rowClassName ? rowClassName(record, index) : '';

                return (
                  <tr
                    key={key}
                    className={`hover:bg-gray-50 ${
                      isSelected ? 'bg-primary-50' : ''
                    } ${customRowClass}`}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(key, e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = record[column.dataIndex];
                      return (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                          {column.render
                            ? column.render(value, record, index)
                            : value}
                        </td>
                      );
                    })}
                    {rowActions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {renderRowActions(record)}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {(pagination.current - 1) * pagination.pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(pagination.current * pagination.pageSize, pagination.total)}
            </span>{' '}
            of <span className="font-medium">{pagination.total}</span> results
          </div>
          <div className="flex items-center gap-2">
            {pagination.showSizeChanger && (
              <select
                value={pagination.pageSize}
                onChange={(e) =>
                  onPaginationChange?.(1, parseInt(e.target.value))
                }
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                {(pagination.pageSizeOptions || [10, 20, 50, 100]).map(
                  (size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  )
                )}
              </select>
            )}
            <button
              onClick={() =>
                onPaginationChange?.(pagination.current - 1, pagination.pageSize)
              }
              disabled={pagination.current <= 1}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.current} of{' '}
              {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() =>
                onPaginationChange?.(pagination.current + 1, pagination.pageSize)
              }
              disabled={
                pagination.current >= Math.ceil(pagination.total / pagination.pageSize)
              }
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;