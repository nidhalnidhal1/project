import { Box, Typography, useTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { tokens } from "../../theme";
import { Header } from "../components";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Categorie = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();

  const [categories, setCategories] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState({ catégorie: "" });
  const [newCategory, setNewCategory] = useState({ catégorie: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const columns = [
    { field: "catégorie", headerName: "Catégorie", width: 250 },
    {
      field: "action",
      headerName: "Action",
      width: 400,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            sx={{ backgroundColor: "#3d59d5", color: "white", marginRight: 2 }}
            onClick={() => handleView(params.row)}
          >
            Voir
          </Button>
          {role === "admin" && (
            <>
              <Button
                variant="contained"
                sx={{ bgcolor: "#3db351", color: "white", marginRight: 2 }}
                onClick={() => handleEdit(params.row)}
              >
                Modifier
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(params.row.id_categorie)}
              >
                Supprimer
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:7001/categorie");
      if (Array.isArray(response.data.data)) {
        const categoriesFormatted = response.data.data.map((category) => ({
          id: category.id_categorie,
          id_categorie: category.id_categorie,
          catégorie: category['catégorie'],
        }));
        setCategories(categoriesFormatted);
      } else {
        console.error("La réponse ne contient pas un tableau de catégories !");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setSnackbarMessage("Erreur lors de la récupération des catégories");
      setSnackbarOpen(true);
    }
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setOpenViewDialog(true);
  };

  const handleEdit = (category) => {
    setEditedCategory(category);
    setOpenEditDialog(true);
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post("http://localhost:7001/categorie", newCategory);
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setOpenAddDialog(false);
      setNewCategory({ catégorie: "" }); // Reset new category state
      setSnackbarMessage("Catégorie ajoutée avec succès !");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding category:", error);
      setSnackbarMessage("Erreur lors de l'ajout de la catégorie");
      setSnackbarOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:7001/categorie/${editedCategory.id_categorie}`, editedCategory);
      setCategories((prevCategories) => 
        prevCategories.map(cat => 
          cat.id_categorie === editedCategory.id_categorie ? response.data : cat
        )
      );
      setOpenEditDialog(false);
      setEditedCategory({ catégorie: "" }); // Reset edited category state
      setSnackbarMessage("Catégorie modifiée avec succès !");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating category:", error);
      setSnackbarMessage("Erreur lors de la mise à jour de la catégorie");
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id_categorie) => {
    try {
      await axios.delete(`http://localhost:7001/categorie/${id_categorie}`);
      setCategories((prevCategories) => prevCategories.filter(cat => cat.id_categorie !== id_categorie));
      setSnackbarMessage("Catégorie supprimée avec succès !");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting category:", error);
      setSnackbarMessage("Erreur lors de la suppression de la catégorie");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box m="20px">
      <Header title="Catégories" />
      {role === "admin" && (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#3d59d5", color: "white", marginBottom: 2 }}
          onClick={() => setOpenAddDialog(true)}
        >
          Ajouter Catégorie
        </Button>
      )}
      <Box
        mt="30px"
        height="50vh"
        width="100vh"
        flex={1}
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#6da5ee",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#6da5ee",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-iconSeparator": {
            color: colors.primary[100],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.gray[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={categories}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          checkboxSelection
        />
      </Box>

      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>Détails de la Catégorie</DialogTitle>
        <DialogContent >
          {selectedCategory && (
            <Box>
              <Typography variant="body1">
                <strong>Catégorie:</strong> {selectedCategory.catégorie}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}
                      sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#b71c1c" } }}
>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>Modifier Catégorie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Catégorie"
            type="text"
            fullWidth
            variant="outlined"
            value={editedCategory.catégorie || ""}
            onChange={(e) => setEditedCategory({ ...editedCategory, catégorie: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}
                      sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#b71c1c" } }}
>Annuler</Button>
          <Button onClick={handleSaveEdit}          
          sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#1565c0" } }}
          >Modifier</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle sx={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', bgcolor: '#1976d2', color: 'white' }}>Ajouter Catégorie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Catégorie"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategory.catégorie || ""}
            onChange={(e) => setNewCategory({ ...newCategory, catégorie: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}
                      sx={{ bgcolor: "#d32f2f", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#b71c1c" } }}
>Annuler</Button>
          <Button onClick={handleAddCategory}
                  sx={{ bgcolor: "#1976d2", color: "white", px: 3, py: 1.5, '&:hover': { bgcolor: "#1565c0" } }}
>Ajouter</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Categorie;