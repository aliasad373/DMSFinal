import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";

const DeleteCardDialog = ({
  open,
  card,
  isDeleting,
  apiError,
  onClose,
  onConfirm,
}) => {
  if (!card) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!isDeleting) {
          onClose();
        }
      }}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            width: 58,
            height: 58,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: "#d92d20",
            backgroundColor: "#fef3f2",
            fontSize: 27,
            fontWeight: 800,
          }}
        >
          !
        </Box>

        <Typography
          sx={{
            mt: 2,
            fontSize: 22,
            fontWeight: 750,
          }}
        >
          Delete Card?
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "#667085",
            lineHeight: 1.6,
          }}
        >
          Delete this{" "}
          <strong>
            {card.category} {card.type}
          </strong>{" "}
          card?
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: "#667085",
            fontSize: 13,
          }}
        >
          This action cannot be undone.
        </Typography>

        {apiError && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              color: "#b42318",
              border:
                "1px solid #fecdca",
              borderRadius: 2,
              backgroundColor:
                "#fef3f2",
            }}
          >
            {apiError}
          </Box>
        )}

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isDeleting}
            sx={{
              minWidth: 100,
              color: "#344054",
              borderColor: "#d0d5dd",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={isDeleting}
            sx={{
              minWidth: 120,
              backgroundColor: "#d92d20",
              boxShadow: "none",
              textTransform: "none",

              "&:hover": {
                backgroundColor: "#b42318",
                boxShadow: "none",
              },
            }}
          >
            {isDeleting ? (
              <>
                <CircularProgress
                  size={18}
                  sx={{
                    mr: 1,
                    color: "#ffffff",
                  }}
                />
                Deleting...
              </>
            ) : (
              "Delete Card"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCardDialog;