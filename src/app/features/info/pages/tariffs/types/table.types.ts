export interface TableRow {
  type: string;
  zones: Record<string, number>;
}

export interface TableData {
  zones: { zone_id: string; zone_name: string }[]; // Headings
  rows: TableRow[]; // strings with caro types
}

// Parcels

export interface ParcelTableCell {
  documents?: number;
  weight_0_5?: number;
  weight_5_10?: number;
  weight_10_20?: number;
}

export interface ParcelTableRow {
  size: string; // "50 cm", "100 cm", etc.
  zones: Record<string, ParcelTableCell>;
}

export interface ParcelsTableData {
  zones: { zone_id: string; zone_name: string }[]; // Headings
  rows: ParcelTableRow[];
  sizeCategories: string[]; // ["50 cm", "100 cm", "130 cm", "160 cm"]
}
