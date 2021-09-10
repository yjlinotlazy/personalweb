import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function PreviewMarkdown({ preview, handlePreviewClose }) {
  return (
    <div>
      <Dialog
        open={preview}
        onClose={handlePreviewClose}
        scroll="paper"
      >
        <DialogContent dividers={true}>
          <DialogContentText
            tabIndex={-1}
          >
            dialogtext
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose} color="primary">
            满意了
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}