import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { Header } from "../components";
import AjouteContrat from "./AjouteContrat";
import AfficherContrat from "./AffichierContrat";
import ModifieContrat from "./ModifieContrat";
import { useAuth } from "../context/AuthContext";

const Contrat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { role } = useAuth();

  const initialContratState = () => ({
    Date_debut: "",
    Heure_debut: "",
    Date_retour: "",
    Heure_retour: "",
    Duree_location: 0,
    Prolongation: 0,
    Numero_contrat: "AC" + Math.floor(Math.random() * 10000),
    Id_vehicule: 0,
    ID_client: 0,
    Prix_total: 0.00,
    Piece_garantie: "",
    Frais: 0.00,
  });

  const [data, setData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedContrat, setSelectedContrat] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newContrat, setNewContrat] = useState(initialContratState());
  const [contratToEdit, setContratToEdit] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [contratToDelete, setContratToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [advancePaymentDate, setAdvancePaymentDate] = useState("");
  const [advancePayment, setAdvancePayment] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:7001/vehicules");
      setVehicles(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules", error);
      setSnackbarMessage("Erreur lors de la récupération des véhicules");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchData();
    fetchClients();
    fetchVehicles();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:7001/contrat");
      setData(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contrats", error);
      setSnackbarMessage("Erreur lors de la récupération des contrats");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:7001/client");
      setClientData(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients", error);
      setSnackbarMessage("Erreur lors de la récupération des clients");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleAddOpen = () => {
    setNewContrat(initialContratState());
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
    setNewContrat(initialContratState());
  };

  const handleOpen = async (contrat) => {
    setSelectedContrat(contrat);
    const clientDetails = await fetchClientDetails(contrat.ID_client);
    const vehicleDetails = await fetchVehicleDetails(contrat.Id_vehicule);
    setSelectedClient(clientDetails);
    setSelectedVehicle(vehicleDetails);
    setOpen(true);
  };

  const fetchClientDetails = async (id_client) => {
    try {
      const response = await axios.get(`http://localhost:7001/client/${id_client}`);
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error("Client details not found");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du client", error);
      setSnackbarMessage("Erreur lors de la récupération des détails du client");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return null;
    }
  };

  const fetchVehicleDetails = async (id_vehicule) => {
    if (!id_vehicule) {
      console.error("ID véhicule non défini");
      return null;
    }
    try {
      const response = await axios.get(`http://localhost:7001/vehicules/${id_vehicule}`);
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error("Détails du véhicule non trouvés");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du véhicule:", error);
      return null;
    }
  };

  const handleEdit = async (contrat) => {
    setContratToEdit(contrat);
    const clientDetails = await fetchClientDetails(contrat.ID_client);
    if (clientDetails) {
      setSelectedClient(clientDetails);
      setOpenEdit(true);
    } else {
      console.error("Failed to fetch client details for editing contract");
      setSnackbarMessage("Erreur lors de la récupération des détails du client");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContrat(null);
    setSelectedClient(null);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setContratToEdit(null);
    setSelectedClient(null);
    setSelectedVehicle(null);
  };

  const handleUpdateContrat = (updatedContrat) => {
    setData((prevData) =>
      prevData.map((contrat) =>
        contrat.Numero_contrat === updatedContrat.Numero_contrat ? updatedContrat : contrat
      )
    );
  };

  const handleDeleteConfirmation = (contrat) => {
    setContratToDelete(contrat);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!contratToDelete) return;

    try {
      await axios.delete(`http://localhost:7001/contrat/${contratToDelete.ID_contrat}`);
      setData((prevData) =>
        prevData.filter((contrat) => contrat.ID_contrat !== contratToDelete.ID_contrat)
      );
      setSnackbarMessage("Contrat supprimé avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du contrat", error);
      setSnackbarMessage("Erreur lors de la suppression du contrat");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setOpenDeleteDialog(false);
    }
  };
    const handleAddContractAndAvanceAndDetailAvance = async () => {
        // Required fields
        const requiredFields = [
            newContrat.Date_debut,
            newContrat.Numero_contrat,
            newContrat.Id_vehicule,
            newContrat.ID_client,
            newContrat.Heure_debut,
            newContrat.Date_retour,
            newContrat.Heure_retour,
            newContrat.Duree_location,
            newContrat.Prix_total,
            advancePaymentDate,
            advancePayment,
            paymentMethod,
            selectedBank
        ];
    
        // Validation
        const allFieldsFilled = requiredFields.every(field => field !== undefined && field !== null && field.toString().trim() !== "");
    
        if (!allFieldsFilled) {
            setSnackbarMessage("Veuillez remplir tous les champs obligatoires.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }
    
        try {
            // Step 1: Add contract
            const response = await axios.post("http://localhost:7001/contrat", newContrat);
            const id_contrat = response.data.data.ID_contrat;
    
            // Step 2: Add advance if applicable
            if (advancePayment > 0) {
                const avanceData = {
                    montant: advancePayment,
                    id_contrat,
                    id_client: newContrat.ID_client,
                    date_avance: advancePaymentDate,
                    modeReglement: paymentMethod,
                    banque: selectedBank,
                };
    
                const avanceResponse = await axios.post("http://localhost:7001/avance", avanceData);
                const id_avance = avanceResponse.data.data.id_avance;
    
                const detailAvanceData = {
                    id_avance,
                    modeReglement: paymentMethod,
                    banque: selectedBank,
                };
    
                await axios.post("http://localhost:7001/detailAvance", detailAvanceData);
            }
    
            // Reset fields and close dialog
            handleClose();
            setSnackbarMessage("Contrat ajouté avec succès !");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
    
            // Refresh data or update state accordingly
            fetchData(); // Fetch contracts again or update state locally
        } catch (error) {
            console.error("Erreur lors de l'ajout du contrat:", error);
            setSnackbarMessage("Erreur lors de l'ajout du contrat: " + (error.response?.data?.message || error.message));
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const getClientName = (id_client) => {
        const client = clientData.find((client) => client.id_client === id_client);
        return client ? `${client.nom_fr} ${client.prenom_fr}` : "Inconnu";
    };

    const columns = [
        { field: "Numero_contrat", headerName: "Numéro Contrat", width: 150 },
        { field: "Date_debut", headerName: "Date Début", width: 150 },
        { field: "Heure_debut", headerName: "Heure Début", width: 150 },
        { field: "Date_retour", headerName: "Date Retour", width: 150 },
        { field: "Heure_retour", headerName: "Heure Retour", width: 150 },
        {
            field: "Client",
            headerName: "Client",
            width: 150,
            valueGetter: (params) => getClientName(params.row.ID_client),
        },
        {
            field: "action",
            headerName: "Action",
            width: 400,
            renderCell: (params) => (
                <Box display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#3d59d5", color: "white", marginRight: 2 }}
                        onClick={() => handleOpen(params.row)}
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
                            <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(params.row)}>
                                Supprimer
                            </Button>
                        </>
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Box m="20px">
            <Header title="Contrats" />
            {role === "admin" && (
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#3c55e2", color: "white" }}
                    onClick={handleAddOpen}
                >
                    Ajouter un Contrat
                </Button>
            )}
            <Box
                mt="30px"
                height="70vh"
                width="130vh"
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
                        backgroundColor: colors.primary[400],
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
                {loading ? (
                    <CircularProgress />
                ) : (
<DataGrid
    rows={data}
    columns={columns}
    getRowId={(row) => row.Numero_contrat}
    components={{ Toolbar: GridToolbar }}
    pagination
    pageSize={10}
    rowsPerPageOptions={[10, 20, 50]} 
    initialState={{
        pagination: {
            paginationModel: {
                pageSize: 10,
                pageSizeOptions: [10, 20, 50],
            },
        },
    }}
/>
                )}
            </Box>

            <AfficherContrat
    open={open}
    handleClose={handleClose}
    selectedContrat={selectedContrat}
    selectedClient={selectedClient}
    selectedVehicle={selectedVehicle} 
/>
<AjouteContrat
    open={openAddDialog}
    handleClose={handleAddClose}
    newContrat={newContrat}
    setNewContrat={setNewContrat}
    handleAddContractAndAvanceAndDetailAvance={handleAddContractAndAvanceAndDetailAvance}
    vehicles={vehicles}
    clients={clientData}
    advancePayment={advancePayment} // Ajoutez cette ligne
    setAdvancePayment={setAdvancePayment} // Ajoutez cette ligne pour permettre la mise à jour
    paymentMethod={paymentMethod} // Ajoutez cette ligne
    setPaymentMethod={setPaymentMethod} // Ajoutez cette ligne pour permettre la mise à jour
/>
            <ModifieContrat
    open={openEdit}
    handleClose={handleCloseEdit} 
    contrat={contratToEdit}
    setContrat={setContratToEdit}
    handleUpdateContrat={handleUpdateContrat}
    selectedClient={selectedClient}
    selectedVehicle={selectedVehicle}
/>
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmation de suppression</DialogTitle>
                <DialogContent>
                    <p>Êtes-vous sûr de vouloir supprimer ce contrat ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Contrat;