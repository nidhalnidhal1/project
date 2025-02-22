import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const initialNewClientState = () => ({
  nom_fr: "",
  nom_ar: "",
  prenom_fr: "",
  prenom_ar: "",
  cin: "",
  date_cin: "",
  date_naiss: "",
  adresse_fr: "",
  adresse_ar: "",
  num_tel: "",
  Numero_Permis: "",
  date_permis: "",
  profession_fr: "",
  profession_ar: "",
  nationalite_origine: "",
});

function AjouteContrat({
  open,
  handleClose,
  newContrat,
  setNewContrat,
  handleAddContractAndAvanceAndDetailAvance,
  vehicles = [],
  clients = [],
}) {
  const [cin, setCin] = useState("");
  const [clientFound, setClientFound] = useState(null);
  const [newClient, setNewClient] = useState(initialNewClientState());
  const [advancePayment, setAdvancePayment] = useState(0);
  const [advancePaymentDate, setAdvancePaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const handleChange = (field) => (event) => {
    setNewContrat((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCinChange = (event) => {
    const enteredCin = event.target.value;
    setCin(enteredCin);
    const client = clients.find((client) => client.cin === enteredCin);
    if (client) {
      setClientFound(client);
      setNewContrat((prev) => ({ ...prev, ID_client: client.id_client }));
      setNewClient(initialNewClientState());
    } else {
      setClientFound(null);
      setNewContrat((prev) => ({ ...prev, ID_client: 0 }));
    }
  };

  const handleVehicleChange = (event) => {
    const vehicle = vehicles.find(
      (v) => v.num_immatriculation === event.target.value
    );
    setSelectedVehicle(vehicle);
    setNewContrat((prev) => ({
      ...prev,
      Id_vehicule: vehicle ? vehicle.id : "",
    }));
  };

  const handleNewClientChange = (field) => (event) => {
    setNewClient((prev) => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    if (selectedVehicle && newContrat.Duree_location) {
      const dailyPrice = Number(selectedVehicle.prix_jour) || 0;
      const duration = Number(newContrat.Duree_location) || 0;
      const additionalFees = Number(newContrat.frais) || 0;

      const totalPrice = dailyPrice * duration + additionalFees - advancePayment;
      setNewContrat((prev) => ({ ...prev, Prix_total: totalPrice }));
    }
  }, [selectedVehicle, newContrat.Duree_location, newContrat.frais, advancePayment]);

  useEffect(() => {
    const { Date_debut, Date_retour } = newContrat;
    if (Date_debut && Date_retour) {
      const startDate = new Date(Date_debut);
      const returnDate = new Date(Date_retour);
      const timeDiff = returnDate - startDate;
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      setNewContrat((prev) => ({ ...prev, Duree_location: daysDiff >= 0 ? daysDiff : 0 }));
    }
  }, [newContrat.Date_debut, newContrat.Date_retour]);

  const validateForm = () => {
    if (
      !cin ||
      !newContrat.Date_debut ||
      !newContrat.Date_retour ||
      !newContrat.Duree_location ||
      !newContrat.Prix_total ||
      !advancePayment ||
      !paymentMethod ||
      !selectedVehicle
    ) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      setSnackbarMessage("Veuillez remplir tous les champs obligatoires.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleAddContractAndAvanceAndDetailAvance();
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "#1976d2", color: "white", textAlign: "center" }}>
        Ajouter un Contrat
      </DialogTitle>
      <DialogContent>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="CIN Client"
                value={cin}
                onChange={handleCinChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Véhicule</InputLabel>
                <Select
                  value={selectedVehicle ? selectedVehicle.num_immatriculation : ""}
                  onChange={handleVehicleChange}
                  label="Véhicule"
                >
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle.id} value={vehicle.num_immatriculation}>
                      {vehicle.num_immatriculation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="Date_debut"
                label="Date de Début"
                type="date"
                fullWidth
                variant="outlined"
                value={newContrat.Date_debut || ""}
                onChange={handleChange("Date_debut")}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="Heure_debut"
                label="Heure de Début"
                type="time"
                fullWidth
                variant="outlined"
                value={newContrat.Heure_debut || ""}
                onChange={handleChange("Heure_debut")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="Date_retour"
                label="Date de Retour"
                type="date"
                fullWidth
                variant="outlined"
                value={newContrat.Date_retour || ""}
                onChange={handleChange("Date_retour")}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="Heure_retour"
                label="Heure de Retour"
                type="time"
                fullWidth
                variant="outlined"
                value={newContrat.Heure_retour || ""}
                onChange={handleChange("Heure_retour")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="Duree_location"
                label="Durée de Location (jours)"
                type="number"
                fullWidth
                variant="outlined"
                value={newContrat.Duree_location || ""}
                onChange={handleChange("Duree_location")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="Prix_total"
                label="Prix Total"
                type="number"
                fullWidth
                variant="outlined"
                value={newContrat.Prix_total || ""}
                onChange={handleChange("Prix_total")}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Montant Avance"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
                type="number"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Date Avance"
                value={advancePaymentDate}
                onChange={(e) => setAdvancePaymentDate(e.target.value)}
                type="date"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Méthode de Règlement</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Méthode de Règlement"
                >
                  <MenuItem value="cheque">Chèque</MenuItem>
                  <MenuItem value="virement">Virement</MenuItem>
                  <MenuItem value="espece">Espèce</MenuItem>
                  <MenuItem value="carte">Carte</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Banque</InputLabel>
                <Select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  label="Banque"
                >
                  {[
                    "Al Baraka Bank Tunisia",
                    "Amen Bank",
                    "Arab Tunisian Bank",
                    "Attijari Bank",
                    "Bank ABC Tunisie",
                    "BH Bank",
                    "Banque de Tunisie",
                    "Banque de Tunisie et des Émirats",
                    "Banque Internationale Arabe de Tunisie",
                    "Banque Nationale Agricole",
                    "Banque Tuniso-Koweïtienne",
                    "Banque Tuniso-Libyenne",
                    "Banque Tunisienne de Solidarité",
                    "Banque Zitouna",
                    "Citibank Tunisie",
                    "Qatar National Bank Tunisia",
                    "Société Tunisienne de Banque",
                    "Tunis International Bank",
                    "Tunisian Saudi Bank",
                    "Union Bancaire pour le Commerce et l'Industrie",
                    "Union Internationale de Banques",
                    "Wifak International Bank",
                  ].map((bank) => (
                    <MenuItem key={bank} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Vehicle Details Section */}
          {selectedVehicle && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Typography variant="h6">Détails du Véhicule Sélectionné:</Typography>
                <Typography>Numéro Immatriculation: {selectedVehicle.num_immatriculation}</Typography>
                <Typography>Marque: {selectedVehicle.constructeur}</Typography>
                <Typography>Modèle: {selectedVehicle.type_commercial}</Typography>
                <Typography>Année: {selectedVehicle.annee}</Typography>
                <Typography>Carrosserie: {selectedVehicle.carrosserie}</Typography>
                <Typography>Énergie: {selectedVehicle.energie}</Typography>
                <Typography>Puissance Fiscale: {selectedVehicle.puissance_fiscale}</Typography>
                <Typography>Nombre de Places: {selectedVehicle.nbr_places}</Typography>
                <Typography>Cylindrée: {selectedVehicle.cylindree}</Typography>
                <Typography>Prix par jour: {selectedVehicle.prix_jour}</Typography>
              </Grid>
            </Grid>
          )}

          {clientFound ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <Typography variant="h6">Détails du Client Trouvé:</Typography>
                <Typography>Nom (FR): {clientFound.nom_fr}</Typography>
                <Typography>Nom (AR): {clientFound.nom_ar}</Typography>
                <Typography>Prénom (FR): {clientFound.prenom_fr}</Typography>
                <Typography>Prénom (AR): {clientFound.prenom_ar}</Typography>
                <Typography>CIN: {clientFound.cin}</Typography>
                <Typography>Date CIN: {clientFound.date_cin}</Typography>
                <Typography>Date de Naissance: {clientFound.date_naiss}</Typography>
                <Typography>Adresse (FR): {clientFound.adresse_fr}</Typography>
                <Typography>Adresse (AR): {clientFound.adresse_ar}</Typography>
                <Typography>Numéro de Téléphone: {clientFound.num_tel}</Typography>
                <Typography>Numéro de Permis: {clientFound.Numero_Permis}</Typography>
                <Typography>Date de Permis: {clientFound.date_permis}</Typography>
                <Typography>Profession (FR): {clientFound.profession_fr}</Typography>
                <Typography>Profession (AR): {clientFound.profession_ar}</Typography>
                <Typography>Nationalité d'Origine: {clientFound.nationalite_origine}</Typography>
              </Grid>
            </Grid>
          ) : (
            cin && (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="h6">Veuillez entrer les détails du nouveau client:</Typography>
                </Grid>
                {[ 
                  { label: "Nom (FR)", field: "nom_fr" },
                  { label: "Nom (AR)", field: "nom_ar", arabic: true },
                  { label: "Prénom (FR)", field: "prenom_fr" },
                  { label: "Prénom (AR)", field: "prenom_ar", arabic: true },
                  { label: "CIN", field: "cin" },
                  { label: "Date CIN", field: "date_cin", type: "date" },
                  { label: "Date de Naissance", field: "date_naiss", type: "date" },
                  { label: "Adresse (FR)", field: "adresse_fr" },
                  { label: "Adresse (AR)", field: "adresse_ar", arabic: true },
                  { label: "Numéro de Téléphone", field: "num_tel" },
                  { label: "Numéro de Permis", field: "Numero_Permis" },
                  { label: "Date de Permis", field: "date_permis", type: "date" },
                  { label: "Profession (FR)", field: "profession_fr" },
                  { label: "Profession (AR)", field: "profession_ar", arabic: true },
                  { label: "Nationalité d'Origine", field: "nationalite_origine" },
                ].map(({ label, field, type, arabic }) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={label}
                      value={newClient[field] || ""}
                      onChange={handleNewClientChange(field)}
                      type={type || "text"}
                      InputLabelProps={type === "date" ? { shrink: true } : {}}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                ))}
              </Grid>
            )
          )}
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Ajouter
        </Button>
        <Button onClick={handleClose} color="error" variant="outlined">
          Annuler
        </Button>
      </DialogActions>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default AjouteContrat;