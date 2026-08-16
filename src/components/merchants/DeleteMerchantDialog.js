import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";

const DeleteMerchantDialog = ({
  open,
  merchant,
  isDeleting = false,
  apiError = "",
  onClose,
  onConfirm,
}) => {
  if (!merchant) {
    return null;
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={
        handleClose
      }
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,

          boxShadow:
            "0 24px 60px rgba(16,24,40,0.18)",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            width: 58,

            height: 58,

            display: "grid",

            placeItems:
              "center",

            borderRadius:
              "50%",

            color:
              "#d92d20",

            backgroundColor:
              "#fef3f2",

            fontSize: 27,

            fontWeight: 800,
          }}
        >
          !
        </Box>

        <Typography
          sx={{
            mt: 2,

            color:
              "#101828",

            fontSize: 22,

            fontWeight: 750,
          }}
        >
          Delete Merchant?
        </Typography>

        <Typography
          sx={{
            mt: 1,

            color:
              "#667085",

            lineHeight: 1.6,
          }}
        >
          Are you sure you
          want to delete the
          merchant with MID{" "}
          <Box
            component="span"
            sx={{
              color:
                "#101828",

              fontWeight: 700,
            }}
          >
            {merchant.mid}
          </Box>
          ?
        </Typography>

        <Typography
          sx={{
            mt: 0.5,

            color:
              "#667085",

            fontSize: 13,
          }}
        >
          This action cannot
          be undone.
        </Typography>

        {apiError && (
          <Box
            sx={{
              mt: 2,

              p: 1.5,

              color:
                "#b42318",

              border:
                "1px solid #fecdca",

              borderRadius:
                2,

              backgroundColor:
                "#fef3f2",

              fontSize: 14,
            }}
          >
            {apiError}
          </Box>
        )}

        <Box
          sx={{
            mt: 4,

            display: "flex",

            justifyContent:
              "flex-end",

            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            onClick={
              handleClose
            }
            disabled={
              isDeleting
            }
            sx={{
              minWidth:
                100,

              minHeight:
                44,

              borderRadius:
                2,

              borderColor:
                "#d0d5dd",

              color:
                "#344054",

              textTransform:
                "none",

              fontWeight:
                650,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              onConfirm
            }
            disabled={
              isDeleting
            }
            sx={{
              minWidth:
                135,

              minHeight:
                44,

              borderRadius:
                2,

              backgroundColor:
                "#d92d20",

              boxShadow:
                "none",

              textTransform:
                "none",

              fontWeight:
                700,

              "&:hover": {
                backgroundColor:
                  "#b42318",

                boxShadow:
                  "none",
              },
            }}
          >
            {isDeleting ? (
              <>
                <CircularProgress
                  size={18}
                  sx={{
                    mr: 1,

                    color:
                      "#ffffff",
                  }}
                />

                Deleting...
              </>
            ) : (
              "Delete Merchant"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMerchantDialog;