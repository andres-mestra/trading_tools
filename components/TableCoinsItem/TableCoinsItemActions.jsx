import { memo } from 'react'
import { Tooltip, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import CalculateIcon from '@mui/icons-material/Calculate'

export const TableCoinsItemActions = memo(
  ({ onEdit, onDelete, onInvertion, onUpdate }) => (
    <div className="item_actions">
      <IconButton color="primary" size="small" onClick={onEdit}>
        <ModeEditIcon />
      </IconButton>
      <IconButton color="error" size="small" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
      <Tooltip title="Calcular capital">
        <IconButton color="secondary" size="small" onClick={onInvertion}>
          <CalculateIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Recalcular entrada">
        <IconButton color="inherit" size="small" onClick={onUpdate}>
          <RestartAltIcon />
        </IconButton>
      </Tooltip>
    </div>
  )
)
