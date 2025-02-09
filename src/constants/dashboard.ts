export const ITEMS_PER_PAGE = 6;

export const EXPORT_HEADERS = {
  QUOTES: ['ID', 'Status', 'CreatedAt', 'UpdatedAt', 'Total', 'Items'] as string[],
  ANALYTICS: [
    'Total_Quotes',
    'Pending_Quotes',
    'Approved_Quotes',
    'Completed_Quotes',
    'Approval_Rate',
    'Pending_Rate',
    'Completion_Rate',
    'Export_Date'
  ] as string[]
};

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  materials: string[];
  hasComments: boolean | null;
  isRushOrder: boolean | null;
}

export const FILTER_INITIAL_STATE: FilterOptions = {
  dateRange: {
    start: '',
    end: ''
  },
  priceRange: {
    min: 0,
    max: 0
  },
  materials: [],
  hasComments: null,
  isRushOrder: null
}; 