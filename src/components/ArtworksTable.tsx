import { useEffect, useState } from "react";
import{ DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { fetchArtworks } from "../api/artworks";
import type { Artwork } from "../types/artwork";
import CustomSelectionOverlay from "./CustomSelectionOverlay";

const ROWS = 12;

const ArtworksTable = () => {
  const [data, setData] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 Persistent Selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [showOverlay, setShowOverlay] = useState(false);

  // Load Data (Server Side)
  const loadData = async (pageNumber: number) => {
    setLoading(true);
    const res = await fetchArtworks(pageNumber);
    setData(res.data);
    setTotalRecords(res.pagination.total);
    setLoading(false);
  };

  useEffect(() => {
    loadData(page + 1);
  }, [page]);

  // Only select rows of current page
  const selectedRows = data.filter((row) =>
    selectedIds.has(row.id)
  );

  const onSelectionChange = (e: any) => {
    const updated = new Set(selectedIds);

    // Remove current page ids
    data.forEach((row) => updated.delete(row.id));

    // Add selected ids
    e.value.forEach((row: Artwork) =>
      updated.add(row.id)
    );

    setSelectedIds(updated);
  };

  const onPage = (event: DataTablePageEvent) => {
    setPage(event.page ?? 0);
  };

  // 🔥 Custom Select
  const handleCustomSelect = (count: number) => {
    const updated = new Set(selectedIds);

    let added = 0;
    for (const row of data) {
      if (added >= count) break;
      updated.add(row.id);
      added++;
    }

    setSelectedIds(updated);
    setShowOverlay(false);
  };

  // 🔥 Footer text like video
  const paginatorLeft = (
    <span>
      Showing {page * ROWS + 1} to{" "}
      {Math.min((page + 1) * ROWS, totalRecords)} of{" "}
      {totalRecords} entries
    </span>
  );

  return (
    <div className="card">
      <div className="table-header">
        <h2>Artworks</h2>
        <Button
          label="Custom Select"
          icon="pi pi-check-square"
          onClick={() => setShowOverlay(true)}
        />
      </div>

      <DataTable
        value={data}
        lazy
        paginator
        rows={ROWS}
        totalRecords={totalRecords}
        first={page * ROWS}
        onPage={onPage}
        loading={loading}
        dataKey="id"
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        paginatorLeft={paginatorLeft}
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        className="p-datatable-striped"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        />

        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      <CustomSelectionOverlay
        visible={showOverlay}
        onClose={() => setShowOverlay(false)}
        onConfirm={handleCustomSelect}
      />
    </div>
  );
};

export default ArtworksTable;