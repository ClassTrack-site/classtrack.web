import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// Página Pública de Presentación (Landing Page)
import { LandingPage } from '@/features/landing/pages/LandingPage';

// Páginas de Autenticación
import { ActivateAccountPage } from '@/features/auth/pages/ActivateAccountPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';

// Páginas Operativas
import { TeacherTodaySessionsPage } from '@/features/sessions/pages/TeacherTodaySessionsPage';
import { AttendanceSheetPage } from '@/features/attendance/pages/AttendanceSheetPage';
import { MyGroupDirectorPage } from '@/features/academic/pages/MyGroupDirectorPage';
import { SchoolAdminDashboardPage } from '@/features/dashboard/pages/SchoolAdminDashboardPage';
import { UsersDirectoryPage } from '@/features/users/pages/UsersDirectoryPage';
import { AcademicStructurePage } from '@/features/academic/pages/AcademicStructurePage';
import { SchedulesMatrixPage } from '@/features/schedules/pages/SchedulesMatrixPage';
import { BulkImportsPage } from '@/features/imports/pages/BulkImportsPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { SuperAdminDashboardPage } from '@/features/schools/pages/SuperAdminDashboardPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas de Presentación y Acceso */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Navigate to="/?login=true" replace />} />
        <Route path="/activate" element={<ActivateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rutas Protegidas en DashboardLayout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Portal Docente */}
          <Route
            path="/teacher/today"
            element={
              <RoleGuard allowedRoles={['teacher']}>
                <TeacherTodaySessionsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/teacher/my-group"
            element={
              <RoleGuard allowedRoles={['teacher']}>
                <MyGroupDirectorPage />
              </RoleGuard>
            }
          />
          <Route
            path="/sessions/:sessionId/attendance"
            element={
              <RoleGuard allowedRoles={['teacher', 'school_admin']}>
                <AttendanceSheetPage />
              </RoleGuard>
            }
          />

          {/* Panel Administrador de Colegio */}
          <Route
            path="/dashboard"
            element={
              <RoleGuard allowedRoles={['school_admin']}>
                <SchoolAdminDashboardPage />
              </RoleGuard>
            }
          />
          <Route
            path="/users"
            element={
              <RoleGuard allowedRoles={['school_admin']}>
                <UsersDirectoryPage />
              </RoleGuard>
            }
          />
          <Route
            path="/academic"
            element={
              <RoleGuard allowedRoles={['school_admin']}>
                <AcademicStructurePage />
              </RoleGuard>
            }
          />
          <Route
            path="/schedules"
            element={
              <RoleGuard allowedRoles={['school_admin', 'teacher']}>
                <SchedulesMatrixPage />
              </RoleGuard>
            }
          />
          <Route
            path="/imports"
            element={
              <RoleGuard allowedRoles={['school_admin']}>
                <BulkImportsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/reports"
            element={
              <RoleGuard allowedRoles={['school_admin', 'teacher']}>
                <ReportsPage />
              </RoleGuard>
            }
          />

          {/* Panel Super Administrador SaaS */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleGuard allowedRoles={['general_admin']}>
                <SuperAdminDashboardPage />
              </RoleGuard>
            }
          />
        </Route>

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
