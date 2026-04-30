import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CFormInput, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilUser } from '@coreui/icons'
import api from 'src/services/api'
import { useToast } from 'src/components/ToastProvider'
import { setUser } from 'src/store/authSlice'

const MyProfile = () => {
  const toast = useToast()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '' })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/api/users/me')
        setValues({
          firstName: res.data?.firstName || '',
          lastName: res.data?.lastName || '',
          email: res.data?.email || '',
        })
      } catch (e) {
        toast.error(e.response?.data?.message || 'No se pudo cargar tu perfil')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onChange = (key, val) => setValues((p) => ({ ...p, [key]: val }))

  const onSave = async () => {
    const email = String(values.email || '').trim()
    if (!email) {
      toast.error('Email es requerido')
      return
    }

    setSaving(true)
    try {
      const res = await api.put('/api/users/me', {
        firstName: String(values.firstName || '').trim() || null,
        lastName: String(values.lastName || '').trim() || null,
        email,
      })
      if (res.data?.user) dispatch(setUser(res.data.user))
      toast.success('Datos actualizados')
    } catch (e) {
      toast.error(e.response?.data?.message || 'No se pudo actualizar tus datos')
    } finally {
      setSaving(false)
    }
  }

  return (
    <CCard>
      <CCardHeader className="d-flex align-items-center">
        <CIcon icon={cilUser} className="me-2" />
        <span className="fw-semibold">Mis datos personales</span>
      </CCardHeader>
      <CCardBody>
        <CRow className="g-3">
          <CCol md={6}>
            <CFormInput
              label="Nombre"
              value={values.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              disabled={loading || saving}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label="Apellido"
              value={values.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              disabled={loading || saving}
            />
          </CCol>
          <CCol md={12}>
            <CFormInput
              type="email"
              label="Email"
              value={values.email}
              onChange={(e) => onChange('email', e.target.value)}
              disabled={loading || saving}
            />
          </CCol>
          <CCol md={12} className="d-flex justify-content-end">
            <CButton color="primary" onClick={onSave} disabled={loading || saving}>
              <CIcon icon={cilSave} className="me-1" />
              Guardar cambios
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default MyProfile

