import React, { useEffect, useState } from 'react'
import {
  CButton,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilCloudDownload, cilList } from '@coreui/icons'

const ExportModal = ({ visible, onClose, onConfirm, submitting, format }) => {
  const [mode, setMode] = useState('all') // all | range
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    if (visible) {
      setMode('all')
      setDateFrom('')
      setDateTo('')
    }
  }, [visible])

  const doConfirm = () => {
    const allRecords = mode === 'all'
    onConfirm({
      allRecords,
      dateFrom: allRecords ? '' : dateFrom,
      dateTo: allRecords ? '' : dateTo,
      format,
    })
  }

  const title = format === 'pdf' ? 'Exportar a PDF' : 'Exportar a Excel'

  return (
    <CModal alignment="center" visible={visible} onClose={onClose} backdrop="static">
      <CModalHeader>
        <CModalTitle className="fw-bold d-flex align-items-center gap-2">
          <CIcon icon={cilCloudDownload} />
          <span style={{ fontSize: 15 }}>{title}</span>
        </CModalTitle>
      </CModalHeader>
      <CForm
        onSubmit={(e) => {
          e.preventDefault()
          doConfirm()
        }}
      >
        <CModalBody style={{ fontSize: 15 }}>
          <div className="mb-2">
            <CFormLabel className="mb-1 fw-bold d-flex align-items-center gap-2">
              <CIcon icon={cilList} />
              <span>Registros</span>
            </CFormLabel>
            <div className="d-flex flex-column gap-2">
              <CFormCheck
                type="radio"
                name="exportMode"
                label="Todos los registros"
                checked={mode === 'all'}
                onChange={() => setMode('all')}
              />
              <CFormCheck
                type="radio"
                name="exportMode"
                label="Rango de fechas"
                checked={mode === 'range'}
                onChange={() => setMode('range')}
              />
            </div>
          </div>

          <div className="d-flex gap-3">
            <div className="flex-grow-1">
              <CFormLabel className="fw-bold d-flex align-items-center gap-2">
                <CIcon icon={cilCalendar} />
                <span>Fecha inicio</span>
              </CFormLabel>
              <CFormInput
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={mode !== 'range'}
              />
            </div>
            <div className="flex-grow-1">
              <CFormLabel className="fw-bold d-flex align-items-center gap-2">
                <CIcon icon={cilCalendar} />
                <span>Fecha termino</span>
              </CFormLabel>
              <CFormInput
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={mode !== 'range'}
              />
            </div>
          </div>
          <div className="small text-body-secondary mt-2">
            Si seleccionas rango, se considera la fecha completa (00:00 a 23:59).
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </CButton>
          <CButton color="primary" type="submit" disabled={submitting}>
            {submitting ? 'Exportando...' : 'Exportar'}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default ExportModal
