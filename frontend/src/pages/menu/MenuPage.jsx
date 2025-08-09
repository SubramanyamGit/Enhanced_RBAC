import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useMenus, useDeleteMenu } from "../../hooks/useMenu";
import CustomTable from "../../components/CustomTable";
import { toast } from "react-toastify";
import AddMenuModal from "../../components/menus/AddMenuModal";
import EditMenuModal from "../../components/menus/EditMenuModal";
import dayjs from "dayjs";

const MenuPage = () => {
  const { data: menus = [], isLoading, error, refetch } = useMenus();
  const deleteMenu = useDeleteMenu();

  const [editMenu, setEditMenu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const columns = [
    { header: "Label", accessor: "label" },
    { header: "Route", accessor: "route" },
    { header: "Menu Key", accessor: "menu_key" },
    {
      header: "Created At",
      accessor: (row) => dayjs(row.created_at).format("MMM D, YYYY h:mm A"),
    },
    {
      header: "Updated At",
      accessor: (row) => dayjs(row.updated_at).format("MMM D, YYYY h:mm A"),
    },
  ];

  const handleDelete = async (menu) => {
    if (window.confirm(`Delete menu "${menu.label}"?`)) {
      try {
        await deleteMenu.mutateAsync(menu.id);
        toast.success("Menu deleted");
        refetch();
      } catch {
        // toast console.error("Failed to delete menu");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Menus</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          + Add Menu
        </Button>
      </div>

      {error ? (
        <Alert variant="danger">Failed to load menus</Alert>
      ) : (
        <CustomTable
          columns={columns}
          data={menus}
          isLoading={isLoading}
          showActions
          onEdit={(row) => setEditMenu(row)}
          onDelete={handleDelete}
        />
      )}

      <AddMenuModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          refetch();
        }}
      />

      <EditMenuModal
        show={!!editMenu}
        menu={editMenu}
        onClose={() => setEditMenu(null)}
        onSuccess={() => {
          setEditMenu(null);
          refetch();
        }}
      />
    </div>
  );
};

export default MenuPage;
